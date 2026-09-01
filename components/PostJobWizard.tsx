"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileInput,
  Loader2,
  LockKeyhole,
  Save,
} from "lucide-react";

import { LiveJobPreview } from "@/components/LiveJobPreview";
import { PlanSelector } from "@/components/PlanSelector";
import {
  BENEFITS,
  FARM_TYPES,
  JOB_CATEGORIES,
  JOB_TYPES,
  TAGS,
  US_STATES,
} from "@/lib/constants";
import {
  DEFAULT_WIZARD_DATA,
  normalizeDraftData,
  type WizardData,
  type WizardDataInput,
} from "@/lib/job-draft-data";
import { trackBeginCheckoutOnceAndWait } from "@/lib/analytics";
import { isCommerceAnalyticsPayload } from "@/lib/commerce-analytics";
import {
  POSTING_ATTRIBUTION_KEYS,
  sanitizePostingLandingPath,
  type PostingFunnelEvent,
} from "@/lib/posting-funnel-events";

type Plan = "basic" | "featured";
type RoleStage = "basics" | "classification";
type DraftFunnelEvent = PostingFunnelEvent extends infer Event
  ? Event extends { draftId: string }
    ? Omit<Event, "draftId">
    : never
  : never;

interface DraftResponse {
  draft: {
    id: string;
    data: Partial<WizardData>;
    plan: Plan;
    currentStep: number;
    recoveryOptIn: boolean;
  };
}

const STEPS = [
  { number: 1, title: "Role & location" },
  { number: 2, title: "Job details" },
  { number: 3, title: "Employer & applications" },
  { number: 4, title: "Preview & payment" },
] as const;

function emailLooksValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function urlLooksValid(value: string) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}

async function readResponseBody<T extends object>(response: Response): Promise<Partial<T>> {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as T;
  } catch {
    return {};
  }
}

export function getRoleBasicsError(data: WizardData) {
  if (data.title.trim().length < 5) return "Add a descriptive job title.";
  if (data.title.trim().length > 100) return "Keep the job title to 100 characters or fewer.";
  if (data.company.trim().length < 2) return "Add your farm or company name.";
  if (data.company.trim().length > 100) return "Keep the farm or company name to 100 characters or fewer.";
  if (data.city.trim().length < 2 || data.city.trim().length > 100 || !US_STATES.some((state) => state.code === data.state)) {
    return "Add a valid job city and state.";
  }
  return null;
}

export function getRoleClassificationError(data: WizardData) {
  if (!data.categories.length || !data.jobType.length || !data.farmType.length) {
    return "Choose at least one category, job type, and operation type.";
  }
  return null;
}

function countPopulatedFields(data: Partial<WizardData>) {
  return Object.values(data).filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return value === true;
  }).length;
}

function funnelStage(step: number, roleStage: RoleStage) {
  if (step === 1) return roleStage === "basics" ? "role_basics" : "role_classification";
  if (step === 2) return "job_details";
  if (step === 3) return "employer_details";
  return "preview";
}

export function PostJobWizard() {
  const searchParams = useSearchParams();
  const initialized = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueue = useRef<Promise<boolean>>(Promise.resolve(true));
  const pendingSaves = useRef(0);
  const postingStartState = useRef<"idle" | "pending" | "sent">("idle");
  const checkoutCancellationTracked = useRef(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [data, setData] = useState<WizardData>(DEFAULT_WIZARD_DATA);
  const [plan, setPlan] = useState<Plan>(searchParams.get("plan") === "featured" ? "featured" : "basic");
  const [step, setStep] = useState(1);
  const [roleStage, setRoleStage] = useState<RoleStage>("basics");
  const [recoveryOptIn, setRecoveryOptIn] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const checkoutCancelled = searchParams.get("checkout") === "cancelled";

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const requestedDraft = searchParams.get("draft");
    const attribution = Object.fromEntries(
      POSTING_ATTRIBUTION_KEYS.flatMap((key) => {
        const value = searchParams.get(key);
        return value ? [[key, value.slice(0, 300)]] : [];
      })
    );

    const loadDraft = async () => {
      try {
        const response = requestedDraft
          ? await fetch(`/api/drafts/${encodeURIComponent(requestedDraft)}`, { cache: "no-store" })
          : await fetch("/api/drafts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                plan,
                explicitPlan: searchParams.has("plan"),
                attribution: {
                  ...attribution,
                  landingPath: sanitizePostingLandingPath(
                    `${window.location.pathname}${window.location.search}`
                  ),
                  referrerHost: document.referrer ? new URL(document.referrer).hostname : undefined,
                },
              }),
            });
        const body = await readResponseBody<DraftResponse & { error?: string }>(response);
        if (!response.ok || !body.draft) {
          throw new Error(body.error || "The posting service is temporarily unavailable. Please try again.");
        }

        const restoredData = { ...DEFAULT_WIZARD_DATA, ...normalizeDraftData(body.draft.data) };
        setDraftId(body.draft.id);
        setData(restoredData);
        setPlan(body.draft.plan);
        setStep(Math.min(4, Math.max(1, body.draft.currentStep || 1)));
        setRoleStage(getRoleBasicsError(restoredData) ? "basics" : "classification");
        setRecoveryOptIn(Boolean(body.draft.recoveryOptIn));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to start a posting draft.");
      } finally {
        setInitializing(false);
      }
    };

    void loadDraft();
  }, [plan, searchParams]);

  const saveDraft = useCallback(
    (overrides?: { nextStep?: number; nextPlan?: Plan }) => {
      if (!draftId) return Promise.resolve(false);
      const snapshot = {
        data,
        plan: overrides?.nextPlan ?? plan,
        currentStep: overrides?.nextStep ?? step,
        recoveryOptIn,
      };
      pendingSaves.current += 1;
      setSaving(true);
      setSaved(false);

      const performSave = async () => {
        try {
          const response = await fetch(`/api/drafts/${encodeURIComponent(draftId)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(snapshot),
          });
          const body = await readResponseBody<{ error?: string }>(response);
          if (!response.ok) throw new Error(body.error || "Unable to save your draft.");
          setSaved(true);
          setTimeout(() => setSaved(false), 2_000);
          return true;
        } catch (saveError) {
          setError(saveError instanceof Error ? saveError.message : "Unable to save your draft.");
          return false;
        } finally {
          pendingSaves.current -= 1;
          if (pendingSaves.current === 0) setSaving(false);
        }
      };

      const queuedSave = saveQueue.current.then(performSave, performSave);
      saveQueue.current = queuedSave;
      return queuedSave;
    },
    [data, draftId, plan, recoveryOptIn, step]
  );

  useEffect(() => {
    if (!draftId || initializing) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void saveDraft(), 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, draftId, initializing, plan, recoveryOptIn, saveDraft]);

  const trackDraftEvent = useCallback(
    async (event: DraftFunnelEvent) => {
      if (!draftId) return false;
      try {
        const response = await fetch("/api/funnel-events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draftId, ...event }),
        });
        return response.ok;
      } catch {
        return false;
      }
    },
    [draftId]
  );

  useEffect(() => {
    if (!checkoutCancelled || !draftId || checkoutCancellationTracked.current) return;
    checkoutCancellationTracked.current = true;
    void trackDraftEvent({
      eventName: "checkout_cancelled",
      properties: { stage: "preview" },
    });
  }, [checkoutCancelled, draftId, trackDraftEvent]);

  const ensurePostingStarted = useCallback(
    (interaction: "form_input" | "import", stage: ReturnType<typeof funnelStage>) => {
      if (postingStartState.current !== "idle") return;
      postingStartState.current = "pending";
      void trackDraftEvent({
        eventName: "posting_started",
        properties: { interaction, stage },
      }).then((tracked) => {
        postingStartState.current = tracked ? "sent" : "idle";
      });
    },
    [trackDraftEvent]
  );

  const setField = <K extends keyof WizardData>(field: K, value: WizardData[K]) => {
    ensurePostingStarted("form_input", funnelStage(step, roleStage));
    setData((current) => ({ ...current, [field]: value }));
    setError(null);
  };

  const toggleArrayValue = (
    field: "jobType" | "farmType" | "categories" | "benefits" | "tags",
    value: string,
    maximum?: number
  ) => {
    ensurePostingStarted("form_input", funnelStage(step, roleStage));
    setData((current) => {
      const values = current[field];
      if (values.includes(value)) {
        return { ...current, [field]: values.filter((item) => item !== value) };
      }
      if (maximum && values.length >= maximum) return current;
      return { ...current, [field]: [...values, value] };
    });
  };

  const stepError = useMemo(() => {
    if (step === 1) {
      return roleStage === "basics" ? getRoleBasicsError(data) : getRoleClassificationError(data);
    }
    if (step === 2) {
      if (data.description.trim().length < 100) return "Write at least 100 characters about the role.";
      const minimum = data.salaryMin ? Number(data.salaryMin) : undefined;
      const maximum = data.salaryMax ? Number(data.salaryMax) : undefined;
      if (
        (minimum != null && (!Number.isSafeInteger(minimum) || minimum < 0)) ||
        (maximum != null && (!Number.isSafeInteger(maximum) || maximum < 0))
      ) {
        return "Enter compensation as whole, positive dollar amounts.";
      }
      if (minimum != null && maximum != null && minimum > maximum) return "Minimum compensation cannot exceed the maximum.";
    }
    if (step === 3) {
      if (!emailLooksValid(data.managementEmail)) return "Add a valid private management email.";
      if (!data.applyUrl && !data.applyEmail) return "Add a public application URL or application email.";
      if (data.applyEmail && !emailLooksValid(data.applyEmail)) return "Add a valid public application email.";
      if (!urlLooksValid(data.applyUrl) || !urlLooksValid(data.companyWebsite) || !urlLooksValid(data.companyLogo)) {
        return "Enter complete URLs without embedded usernames or passwords.";
      }
    }
    return null;
  }, [data, roleStage, step]);

  const goToStep = async (nextStep: number) => {
    if (nextStep > step && stepError) {
      setError(stepError);
      return false;
    }
    setError(null);
    const savedStep = await saveDraft({ nextStep });
    if (!savedStep) return false;
    setStep(nextStep);
    if (nextStep === 4 && draftId) {
      void trackDraftEvent({ eventName: "preview_viewed" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => document.getElementById(`step-${nextStep}-title`)?.focus(), 0);
    return true;
  };

  const continueFromRoleBasics = async () => {
    const validationError = getRoleBasicsError(data);
    if (validationError) {
      setError(validationError);
      return;
    }
    ensurePostingStarted("form_input", "role_basics");
    setError(null);
    const savedBasics = await saveDraft();
    if (!savedBasics) return;
    void trackDraftEvent({
      eventName: "posting_role_basics_completed",
      properties: { method: importNotice ? "import" : "manual" },
    });
    setRoleStage("classification");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => document.getElementById("step-1-title")?.focus(), 0);
  };

  const continueFromClassification = async () => {
    const validationError = getRoleClassificationError(data);
    if (validationError) {
      setError(validationError);
      return;
    }
    const completedEvent: DraftFunnelEvent = {
      eventName: "posting_classification_completed",
      properties: {
        categoryCount: data.categories.length,
        jobTypeCount: data.jobType.length,
        operationTypeCount: data.farmType.length,
      },
    };
    const advanced = await goToStep(2);
    if (advanced) void trackDraftEvent(completedEvent);
  };

  const handleBack = async () => {
    if (step === 1 && roleStage === "classification") {
      const savedClassification = await saveDraft();
      if (!savedClassification) return;
      setError(null);
      setRoleStage("basics");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => document.getElementById("step-1-title")?.focus(), 0);
      return;
    }
    await goToStep(step - 1);
  };

  const handleContinue = async () => {
    if (step === 1) {
      if (roleStage === "basics") await continueFromRoleBasics();
      else await continueFromClassification();
      return;
    }
    await goToStep(step + 1);
  };

  const handleImport = async () => {
    ensurePostingStarted("import", "role_basics");
    void trackDraftEvent({
      eventName: "job_import_attempted",
      properties: { stage: "role_basics" },
    });
    if (!urlLooksValid(importUrl) || !importUrl) {
      void trackDraftEvent({
        eventName: "job_import_failed",
        properties: { statusCode: 400 },
      });
      setError("Enter the complete URL of an existing job post.");
      return;
    }
    setImporting(true);
    setError(null);
    setImportNotice(null);
    let statusCode = 0;
    try {
      const response = await fetch("/api/job-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl, draftId }),
      });
      statusCode = response.status;
      const body = await readResponseBody<{
        error?: string;
        fields?: WizardDataInput;
        sourceUrl?: string;
        extraction?: "structured" | "metadata";
        warnings?: string[];
      }>(response);
      if (!response.ok) throw new Error(body.error || "Unable to import this job.");
      const imported = normalizeDraftData(body.fields ?? {});
      setData((current) => ({ ...current, ...imported }));
      setImportNotice(
        body.warnings?.join(" ") ||
        "We filled the details we could verify. Review every field and the full listing preview before payment."
      );
      if (draftId) {
        void fetch(`/api/drafts/${encodeURIComponent(draftId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ importUrl: body.sourceUrl }),
        });
        void trackDraftEvent({
          eventName: "job_import_succeeded",
          properties: {
            extraction: body.extraction,
            populatedFieldCount: countPopulatedFields(imported),
            warningCount: body.warnings?.length ?? 0,
          },
        });
      }
    } catch (importError) {
      if (draftId) {
        void trackDraftEvent({
          eventName: "job_import_failed",
          properties: { statusCode },
        });
      }
      setError(importError instanceof Error ? importError.message : "Unable to import this job.");
    } finally {
      setImporting(false);
    }
  };

  const handlePlanChange = (nextPlan: Plan) => {
    setPlan(nextPlan);
    void saveDraft({ nextPlan });
    if (draftId) {
      void trackDraftEvent({
        eventName: "plan_selected",
        properties: { plan: nextPlan },
      });
    }
  };

  const handleCheckout = async () => {
    if (!draftId) return;
    setSubmitting(true);
    setError(null);
    try {
      const savedDraft = await saveDraft({ nextStep: 4 });
      if (!savedDraft) {
        setSubmitting(false);
        return;
      }
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId }),
      });
      const body = await readResponseBody<{
        error?: string;
        url?: string;
        sessionId?: string;
        analytics?: unknown;
        details?: { fieldErrors?: Record<string, string[]>; formErrors?: string[] };
      }>(response);
      if (!response.ok || !body.url) {
        const fieldMessage = Object.values(body.details?.fieldErrors ?? {}).flat().find(Boolean);
        const formMessage = body.details?.formErrors?.find(Boolean);
        throw new Error(fieldMessage || formMessage || body.error || "Unable to open secure checkout.");
      }
      if (
        isCommerceAnalyticsPayload(body.analytics) &&
        typeof body.sessionId === "string" &&
        body.sessionId.length <= 255
      ) {
        await trackBeginCheckoutOnceAndWait(body.analytics, body.sessionId);
      }
      window.location.assign(body.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to open secure checkout.");
      setSubmitting(false);
    }
  };

  if (initializing) {
    return (
      <main className="min-h-screen bg-earth-cream py-12">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-forest-light">Preparing your secure posting draft…</p>
        </div>
      </main>
    );
  }

  if (!draftId) {
    return (
      <main className="min-h-screen bg-earth-cream py-12">
        <div className="container mx-auto max-w-xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">For employers</p>
          <h1 className="mt-2 text-3xl font-display text-forest sm:text-4xl">We couldn&apos;t start your secure draft</h1>
          <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
            {error || "The posting service is temporarily unavailable. Please try again."} No information has been saved.
          </div>
          <button type="button" onClick={() => window.location.reload()} className="btn btn-primary mt-6 justify-center">
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-earth-cream py-8 sm:py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <header className="mx-auto mb-8 max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">For employers</p>
          <h1 className="text-3xl font-display text-forest sm:text-5xl">Post an agricultural job</h1>
          <p className="mt-3 text-lg text-forest-light">A guided four-step listing. Your draft saves as you go.</p>
        </header>

        <ol className="mx-auto mb-8 grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Posting progress">
          {STEPS.map((item) => (
            <li key={item.number}>
              <button
                type="button"
                onClick={() => item.number <= step && void goToStep(item.number)}
                disabled={item.number > step}
                aria-current={item.number === step ? "step" : undefined}
                className={`flex min-h-16 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left ${
                  item.number === step
                    ? "border-primary bg-white text-forest shadow-soft"
                    : item.number < step
                      ? "border-primary/30 bg-primary/5 text-forest"
                      : "border-border bg-white/60 text-forest-light"
                }`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${item.number <= step ? "bg-primary text-white" : "bg-gray-100"}`}>
                  {item.number < step ? <Check className="h-4 w-4" /> : item.number}
                </span>
                <span className="text-sm font-semibold leading-tight">{item.title}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mb-4 flex min-h-6 items-center justify-end gap-2 text-sm text-forest-light" aria-live="polite">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving draft…" : saved ? "Draft saved" : "Draft autosaves"}
        </div>

        {checkoutCancelled ? (
          <div role="status" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Secure checkout closed before payment was confirmed. Your draft is safe—review it and continue whenever you&apos;re ready.
          </div>
        ) : null}

        {error ? (
          <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {step === 1 ? (
          <section className="card p-5 sm:p-8" aria-labelledby="step-1-title">
            {roleStage === "basics" ? (
              <>
                <div className="mb-7">
                  <p className="text-sm font-semibold text-primary">Step 1 of 4 · Part 1 of 2</p>
                  <h2 id="step-1-title" tabIndex={-1} className="mt-1 w-fit rounded-sm text-2xl font-display text-forest focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-emerald-700">Start with the essentials</h2>
                  <p className="mt-2 text-sm leading-relaxed text-forest-light">A title, company, and location are enough to begin. We&apos;ll ask how to classify the role next.</p>
                </div>

                <div className="mb-8 overflow-hidden rounded-xl border-2 border-primary/25 bg-gradient-to-br from-primary/10 via-white to-accent-yellow/10">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white" aria-hidden="true">
                        <FileInput className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Fastest option</p>
                        <h3 className="mt-1 text-xl font-display text-forest">Import an existing job post</h3>
                        <p className="mt-1 text-sm leading-relaxed text-forest-light">Paste a public job-page link and we&apos;ll fill in the details we can verify. You&apos;ll review everything before payment.</p>
                      </div>
                    </div>
                    <label htmlFor="import-url" className="mt-5 block text-sm font-semibold text-forest">Public job-post URL</label>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                      <input id="import-url" type="url" value={importUrl} onChange={(event) => setImportUrl(event.target.value)} className="input" placeholder="https://yourfarm.com/jobs/farm-manager" />
                      <button type="button" onClick={handleImport} disabled={importing} className="btn btn-primary shrink-0 justify-center">
                        {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileInput className="h-4 w-4" />}
                        {importing ? "Importing…" : "Import job details"}
                      </button>
                    </div>
                    {importNotice ? <p className="mt-3 text-sm leading-relaxed text-emerald-700">{importNotice}</p> : null}
                  </div>
                </div>

                <div className="mb-7 flex items-center gap-3" aria-hidden="true">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-forest-light">or enter the essentials</span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Job title" required className="sm:col-span-2">
                    <input value={data.title} onChange={(event) => setField("title", event.target.value)} className="input" placeholder="Seasonal greenhouse grower" maxLength={100} autoComplete="organization-title" />
                  </Field>
                  <Field label="Farm or company name" required className="sm:col-span-2">
                    <input value={data.company} onChange={(event) => setField("company", event.target.value)} className="input" placeholder="Green Valley Nursery" maxLength={100} autoComplete="organization" />
                  </Field>
                  <Field label="City" required>
                    <input value={data.city} onChange={(event) => setField("city", event.target.value)} className="input" maxLength={100} autoComplete="address-level2" />
                  </Field>
                  <Field label="State" required>
                    <select value={data.state} onChange={(event) => setField("state", event.target.value)} className="input" autoComplete="address-level1">
                      <option value="">Select a state</option>
                      {US_STATES.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Postal code">
                    <input value={data.postalCode} onChange={(event) => setField("postalCode", event.target.value)} className="input" maxLength={10} autoComplete="postal-code" />
                  </Field>
                  <label className="flex min-h-11 items-center gap-3 rounded-lg border border-border px-4 py-2 sm:self-end">
                    <input type="checkbox" checked={data.remote} onChange={(event) => setField("remote", event.target.checked)} className="h-5 w-5 accent-primary" />
                    <span className="font-medium text-forest">Remote or partly remote</span>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-sm font-semibold text-primary">Step 1 of 4 · Part 2 of 2</p>
                    <h2 id="step-1-title" tabIndex={-1} className="mt-1 w-fit rounded-sm text-2xl font-display text-forest focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-emerald-700">Help candidates find this role</h2>
                    <p className="mt-2 text-sm leading-relaxed text-forest-light">Choose the labels job seekers will use to discover this opening.</p>
                  </div>
                  <button type="button" onClick={() => setRoleStage("basics")} className="btn btn-outline shrink-0">Edit essentials</button>
                </div>

                <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-forest-light">
                  <span className="font-semibold text-forest">{data.title}</span> at {data.company} · {data.city}, {data.state}
                </div>

                <ChoiceGroup title="Job categories" help="Choose up to three." items={JOB_CATEGORIES} selected={data.categories} onToggle={(value) => toggleArrayValue("categories", value, 3)} />
                <ChoiceGroup title="Job type" items={JOB_TYPES} selected={data.jobType} onToggle={(value) => toggleArrayValue("jobType", value)} />
                <ChoiceGroup title="Operation type" items={FARM_TYPES} selected={data.farmType} onToggle={(value) => toggleArrayValue("farmType", value)} />
              </>
            )}
          </section>
        ) : null}

        {step === 2 ? (
          <section className="card p-5 sm:p-8" aria-labelledby="step-2-title">
            <p className="text-sm font-semibold text-primary">Step 2 of 4</p>
            <h2 id="step-2-title" tabIndex={-1} className="mt-1 w-fit rounded-sm text-2xl font-display text-forest focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-emerald-700">Description, pay and benefits</h2>
            <div className="mt-6 space-y-6">
              <Field label="Job description" required help={`${data.description.length}/5,000 characters — include responsibilities, schedule, qualifications and what makes the workplace distinctive.`}>
                <textarea value={data.description} onChange={(event) => setField("description", event.target.value)} className="input min-h-64 resize-y" maxLength={5_000} />
              </Field>
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-forest">Compensation period</legend>
                <div className="flex gap-5">
                  {(["hourly", "annual"] as const).map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input type="radio" name="salary-type" checked={data.salaryType === type} onChange={() => setField("salaryType", type)} className="h-4 w-4 accent-primary" />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Minimum compensation">
                  <input type="number" min="0" step="1" value={data.salaryMin} onChange={(event) => setField("salaryMin", event.target.value)} className="input" />
                </Field>
                <Field label="Maximum compensation">
                  <input type="number" min="0" step="1" value={data.salaryMax} onChange={(event) => setField("salaryMax", event.target.value)} className="input" />
                </Field>
              </div>
            </div>
            <ChoiceGroup title="Benefits" help="Optional" items={BENEFITS} selected={data.benefits} onToggle={(value) => toggleArrayValue("benefits", value)} />
            <ChoiceGroup title="Role tags" help="Optional" items={TAGS} selected={data.tags} onToggle={(value) => toggleArrayValue("tags", value)} />
          </section>
        ) : null}

        {step === 3 ? (
          <section className="card p-5 sm:p-8" aria-labelledby="step-3-title">
            <p className="text-sm font-semibold text-primary">Step 3 of 4</p>
            <h2 id="step-3-title" tabIndex={-1} className="mt-1 w-fit rounded-sm text-2xl font-display text-forest focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-emerald-700">Employer and application details</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Private management email" required help="Used for receipts, secure sign-in and listing management. It is never shown publicly." className="sm:col-span-2">
                <input type="email" value={data.managementEmail} onChange={(event) => setField("managementEmail", event.target.value)} className="input" autoComplete="email" />
              </Field>
              <Field label="Company website">
                <input type="url" value={data.companyWebsite} onChange={(event) => setField("companyWebsite", event.target.value)} className="input" placeholder="https://yourfarm.com" />
              </Field>
              <Field label="Company logo URL">
                <input type="url" value={data.companyLogo} onChange={(event) => setField("companyLogo", event.target.value)} className="input" placeholder="https://yourfarm.com/logo.png" />
              </Field>
            </div>
            <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
              <h3 className="text-lg font-display text-forest">How should candidates apply?</h3>
              <p className="mt-1 text-sm text-forest-light">At least one of these fields is required. Only the application contact is public.</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Application URL">
                  <input type="url" value={data.applyUrl} onChange={(event) => setField("applyUrl", event.target.value)} className="input" placeholder="https://yourfarm.com/apply" />
                </Field>
                <Field label="Public application email">
                  <input type="email" value={data.applyEmail} onChange={(event) => setField("applyEmail", event.target.value)} className="input" placeholder="jobs@yourfarm.com" />
                </Field>
              </div>
            </div>
            <label className="mt-6 flex items-start gap-3 rounded-lg border border-border p-4">
              <input type="checkbox" checked={recoveryOptIn} onChange={(event) => setRecoveryOptIn(event.target.checked)} className="mt-0.5 h-5 w-5 accent-primary" />
              <span>
                <span className="block font-semibold text-forest">Email me one link if I leave this draft unfinished</span>
                <span className="mt-1 block text-sm text-forest-light">No marketing sequence. You can finish without opting in.</span>
              </span>
            </label>
          </section>
        ) : null}

        {step === 4 ? (
          <section aria-labelledby="step-4-title">
            <div className="mb-6">
              <p className="text-sm font-semibold text-primary">Step 4 of 4</p>
              <h2 id="step-4-title" tabIndex={-1} className="mt-1 w-fit rounded-sm text-2xl font-display text-forest focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-emerald-700">Review and choose placement</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <div className="space-y-5">
                <LiveJobPreview data={data} featured={plan === "featured"} />
                <div className="card p-5 text-sm text-forest-light">
                  <h3 className="mb-3 text-lg font-display text-forest">Before payment</h3>
                  <dl className="grid gap-2 sm:grid-cols-2">
                    <div className="min-w-0"><dt className="font-semibold text-forest">Applications</dt><dd className="break-all">{data.applyUrl || data.applyEmail}</dd></div>
                    <div className="min-w-0"><dt className="font-semibold text-forest">Management</dt><dd className="break-all">{data.managementEmail} (private)</dd></div>
                    <div className="min-w-0"><dt className="font-semibold text-forest">Duration</dt><dd>60 days</dd></div>
                    <div className="min-w-0"><dt className="font-semibold text-forest">Renewal</dt><dd>Manual only</dd></div>
                  </dl>
                </div>
              </div>
              <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                <PlanSelector selected={plan} onChange={handlePlanChange} />
                <button type="button" onClick={handleCheckout} disabled={submitting || saving} className="btn btn-primary w-full justify-center py-3 text-lg">
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <LockKeyhole className="h-5 w-5" />}
                  {submitting ? "Opening secure checkout…" : `Continue to secure payment — ${plan === "featured" ? "$25" : "$15"}`}
                </button>
                <p className="text-center text-xs text-forest-light">Payment is handled by Stripe. Your listing publishes only after payment is confirmed.</p>
              </div>
            </div>
          </section>
        ) : null}

        <nav className="mt-7 flex items-center justify-between gap-4" aria-label="Posting steps">
          <button type="button" onClick={() => void handleBack()} disabled={(step === 1 && roleStage === "basics") || submitting} className="btn btn-outline disabled:cursor-not-allowed disabled:opacity-40">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 4 ? (
            <button type="button" onClick={() => void handleContinue()} className="btn btn-primary">
              {step === 1 && roleStage === "basics" ? "Continue to role details" : "Continue"} <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}
        </nav>
      </div>
    </main>
  );
}

function Field({
  label,
  help,
  required,
  className = "",
  children,
}: {
  label: string;
  help?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-forest">{label}{required ? " *" : ""}</span>
      {children}
      {help ? <span className="mt-2 block text-xs leading-relaxed text-forest-light">{help}</span> : null}
    </label>
  );
}

function ChoiceGroup({
  title,
  help,
  items,
  selected,
  onToggle,
}: {
  title: string;
  help?: string;
  items: ReadonlyArray<{ id: string; label: string; emoji?: string }>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="mt-8">
      <legend className="text-lg font-display text-forest">{title}</legend>
      {help ? <p className="mt-1 text-sm text-forest-light">{help}</p> : null}
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const checked = selected.includes(item.id);
          return (
            <label key={item.id} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${checked ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/40"}`}>
              <input type="checkbox" checked={checked} onChange={() => onToggle(item.id)} className="h-4 w-4 accent-primary" />
              {item.emoji ? <span aria-hidden="true">{item.emoji}</span> : null}
              <span className="text-sm font-medium text-forest">{item.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
