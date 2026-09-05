"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Link2,
  Loader2,
  Sprout,
} from "lucide-react";
import { US_STATES } from "@/lib/constants";
import {
  WORKSHOP_FORMATS,
  WORKSHOP_LEVELS,
  WORKSHOP_TOPICS,
  workshopFormat,
  workshopPrice,
  workshopDate,
} from "@/lib/workshop-types";
import {
  localWorkshopDate,
  workshopSchema,
  workshopWallTime,
  validateUpcomingWorkshop,
  type WorkshopInput,
} from "@/lib/workshop-validation";
import { trackAnalyticsEvent } from "@/lib/analytics";

const STORAGE_KEY = "pidj:workshop-draft:v1";
type Fields = Omit<
  WorkshopInput,
  "startAt" | "endAt" | "registrationClosesAt" | "tuitionCents" | "outcomes"
> & {
  start: string;
  end: string;
  closes: string;
  tuition: string;
  outcomesText: string;
};
const EMPTY: Fields = {
  title: "",
  organization: "",
  instructor: "",
  summary: "",
  description: "",
  outcomesText: "",
  audience: "",
  prerequisites: "",
  topic: "growing",
  format: "in-person",
  level: "Beginner",
  city: "",
  state: "",
  venue: "",
  address: "",
  postalCode: "",
  start: "",
  end: "",
  closes: "",
  timeZone: "America/New_York",
  scheduleNotes: "",
  tuition: "",
  priceNotes: "",
  registrationUrl: "",
  organizerWebsite: "",
  managementEmail: "",
};
const STEPS = [
  "Workshop & location",
  "Learning details",
  "Organizer & registration",
  "Preview & payment",
];
const ZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "UTC",
];
const inputClass =
  "mt-2 min-h-12 w-full rounded-lg border border-[#cbd2c3] bg-white px-3 py-2.5 text-base text-forest focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-earth-sand";
function fieldsFromInput(input: WorkshopInput): Fields {
  return {
    ...input,
    start: workshopWallTime(input.startAt, input.timeZone),
    end: workshopWallTime(input.endAt, input.timeZone),
    closes: workshopWallTime(input.registrationClosesAt, input.timeZone),
    tuition: String(input.tuitionCents / 100),
    outcomesText: input.outcomes.join("\n"),
  };
}
function toInput(fields: Fields) {
  return {
    ...fields,
    startAt:
      fields.format === "self-paced"
        ? null
        : localWorkshopDate(fields.start, fields.timeZone),
    endAt:
      fields.format === "self-paced"
        ? null
        : localWorkshopDate(fields.end, fields.timeZone),
    registrationClosesAt: localWorkshopDate(fields.closes, fields.timeZone),
    tuitionCents: fields.tuition.trim()
      ? Math.round(Number(fields.tuition) * 100)
      : NaN,
    outcomes: fields.outcomesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  };
}
function identity() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return {
    requestId: crypto.randomUUID(),
    token: btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, ""),
  };
}
export function WorkshopWizard({
  initial,
  manage,
}: {
  initial?: WorkshopInput;
  manage?: { id: string; token: string };
}) {
  const [fields, setFields] = useState<Fields>(
    initial ? fieldsFromInput(initial) : EMPTY,
  );
  const [step, setStep] = useState(1),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false);
  const [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [url, setUrl] = useState("");
  const [reviewed, setReviewed] = useState(false),
    [saved, setSaved] = useState(false),
    [finished, setFinished] = useState(false);
  const [requestIdentity, setRequestIdentity] = useState<{
    requestId: string;
    token: string;
  } | null>(null);
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!manage) {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (
          stored?.fields &&
          typeof stored.fields === "object" &&
          Date.now() - stored.savedAt < 30 * 86400000
        ) {
          setFields({ ...EMPTY, ...stored.fields });
          setStep(Math.min(4, Math.max(1, Number(stored.step) || 1)));
          if (stored.identity?.requestId && stored.identity?.token)
            setRequestIdentity(stored.identity);
          setNotice("Your saved workshop draft is ready.");
        }
      } catch {
        /* Private browsing can disable storage. */
      }
      trackAnalyticsEvent("workshop_post_started");
    }
    setReady(true);
  }, [manage]);
  useEffect(() => {
    if (!ready || manage) return;
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            fields,
            step,
            identity: requestIdentity,
            savedAt: Date.now(),
          }),
        );
        setSaved(true);
      } catch {
        setSaved(false);
      }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [fields, step, ready, manage, requestIdentity]);
  const change = (key: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setError("");
    setReviewed(false);
  };
  const field = (
    key: keyof Fields,
    label: string,
    options: {
      type?: string;
      placeholder?: string;
      required?: boolean;
      hint?: string;
      rows?: number;
      maxLength?: number;
    } = {},
  ) => (
    <label className="block text-sm font-semibold text-forest">
      {label}
      {options.required ? (
        <span className="ml-1 text-secondary-dark">*</span>
      ) : null}
      {options.rows ? (
        <textarea
          value={fields[key]}
          onChange={(event) => change(key, event.target.value)}
          rows={options.rows}
          maxLength={options.maxLength}
          placeholder={options.placeholder}
          className={inputClass}
        />
      ) : (
        <input
          type={options.type || "text"}
          readOnly={Boolean(manage && key === "managementEmail")}
          value={fields[key]}
          onChange={(event) => change(key, event.target.value)}
          placeholder={options.placeholder}
          maxLength={options.maxLength}
          min={options.type === "number" ? "0" : undefined}
          step={options.type === "number" ? "0.01" : undefined}
          className={inputClass}
        />
      )}
      {options.hint ? (
        <span className="mt-2 block text-xs font-normal leading-relaxed text-earth-brown">
          {options.hint}
        </span>
      ) : null}
    </label>
  );
  async function importDetails() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/workshops/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setFields((current) => {
        const next = { ...current };
        for (const [key, value] of Object.entries(data.fields ?? {})) {
          if (
            key in next &&
            !next[key as keyof Fields] &&
            typeof value === "string"
          )
            (next as Record<string, unknown>)[key] = value;
        }
        if (!current.tuition && typeof data.fields.tuitionCents === "number")
          next.tuition = String(data.fields.tuitionCents / 100);
        if (!current.start && data.fields.startAt)
          next.start = workshopWallTime(data.fields.startAt, current.timeZone);
        if (!current.end && data.fields.endAt)
          next.end = workshopWallTime(data.fields.endAt, current.timeZone);
        return next;
      });
      setNotice(
        "Available details imported into empty fields. Confirm the dates, time zone, tuition and registration destination before paying.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Import unavailable. Enter the details below.",
      );
    } finally {
      setBusy(false);
    }
  }
  function validateStep() {
    try {
      if (step === 1) {
        if (fields.format !== "self-paced" && !fields.start)
          throw new Error("Add the course start date and local time.");
        if (
          fields.format === "in-person" &&
          (!fields.city || !fields.state || !fields.venue || !fields.address)
        )
          throw new Error("Add the city, state, venue and street address.");
      }
      const parsed = workshopSchema.safeParse(toInput(fields));
      const relevant =
        step === 1
          ? [
              "title",
              "topic",
              "format",
              "city",
              "state",
              "venue",
              "address",
              "startAt",
              "endAt",
              "timeZone",
              "registrationClosesAt",
            ]
          : step === 2
            ? [
                "summary",
                "description",
                "outcomes",
                "audience",
                "level",
                "tuitionCents",
              ]
            : [
                "organization",
                "managementEmail",
                "registrationUrl",
                "organizerWebsite",
              ];
      const problem =
        !parsed.success &&
        parsed.error.issues.find((issue) =>
          relevant.includes(String(issue.path[0])),
        );
      if (problem)
        throw new Error(
          `${String(problem.path[0]).replace(/([A-Z])/g, " $1")}: ${problem.message}`,
        );
      if (step === 3 && !parsed.success)
        throw new Error(parsed.error.issues[0].message);
      if (parsed.success) validateUpcomingWorkshop(parsed.data);
      return true;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Please check the details.",
      );
      return false;
    }
  }
  function move(next: number) {
    if (next > step && !validateStep()) return;
    setStep(next);
    setError("");
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function submit() {
    setBusy(true);
    setError("");
    try {
      if (!reviewed)
        throw new Error(
          "Confirm your authority and the listing details before continuing.",
        );
      const input = workshopSchema.parse(toInput(fields));
      validateUpcomingWorkshop(input);
      if (manage) {
        const response = await fetch(`/api/workshops/manage/${manage.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${manage.token}`,
          },
          body: JSON.stringify({ workshop: input }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setFinished(true);
        return;
      }
      const key = requestIdentity ?? identity();
      setRequestIdentity(key);
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            fields,
            step: 4,
            identity: key,
            savedAt: Date.now(),
          }),
        );
      } catch {
        /* In-memory identity still prevents double submission. */
      }
      trackAnalyticsEvent("workshop_checkout_started");
      const response = await fetch("/api/workshops/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...key, workshop: input, reviewed: true }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to start checkout.");
      if (
        typeof data.url !== "string" ||
        new URL(data.url).hostname !== "checkout.stripe.com"
      )
        throw new Error("Checkout is temporarily unavailable.");
      window.location.assign(data.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function unlockCheckout() {
    if (!requestIdentity) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        `/api/workshops/manage/${requestIdentity.requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${requestIdentity.token}`,
          },
          body: JSON.stringify({ action: "cancel_checkout" }),
        },
      );
      const data = await response.json();
      if (!response.ok && response.status !== 404) throw new Error(data.error);
      if (response.ok && !data.canceled)
        throw new Error(
          "Payment is processing. Check your email before starting another checkout.",
        );
      setRequestIdentity(null);
      setNotice(
        "The previous checkout is closed. You can edit your draft and start a new checkout.",
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not close checkout.",
      );
    } finally {
      setBusy(false);
    }
  }
  const preview = (() => {
    try {
      return toInput(fields);
    } catch {
      return null;
    }
  })();
  if (finished)
    return (
      <div className="rounded-2xl border border-primary/20 bg-white p-8">
        <Check className="h-9 w-9 text-primary" />
        <h2 className="mt-4 font-display text-3xl text-forest">
          Changes submitted.
        </h2>
        <p className="mt-3 text-forest-light">
          We’ll review the updated listing and email you when it is live. Your
          original promotion end date still applies.
        </p>
        <Link href="/workshops" className="btn btn-primary mt-6">
          Explore workshops
        </Link>
      </div>
    );
  return (
    <div ref={top} className="scroll-mt-24">
      <ol aria-label="Posting progress" className="mb-7 grid grid-cols-4 gap-2">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={`border-t-[3px] pt-3 ${step >= index + 1 ? "border-primary" : "border-border"}`}
            aria-current={step === index + 1 ? "step" : undefined}
          >
            <span
              className={`mb-1 block text-xs font-bold ${step >= index + 1 ? "text-primary" : "text-earth-brown"}`}
            >
              0{index + 1}
            </span>
            <span className="hidden text-xs font-medium text-forest sm:block">
              {manage && index === 3 ? "Preview & submit" : label}
            </span>
          </li>
        ))}
      </ol>
      <div className="rounded-2xl border border-[#d9ddcc] bg-white p-5 shadow-soft sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary-dark">
              Step {step} of 4
            </p>
            <h2 className="mt-2 font-display text-3xl text-forest">
              {step === 4 && manage ? "Preview & submit" : STEPS[step - 1]}
            </h2>
          </div>
          {saved && !manage ? (
            <span className="inline-flex items-center gap-1 text-xs text-primary">
              <Check className="h-3 w-3" />
              Saved on this device
            </span>
          ) : null}
        </div>
        {notice ? (
          <p
            role="status"
            className="mb-5 rounded-lg bg-[#edf3e7] p-4 text-sm leading-relaxed text-forest-light"
          >
            {notice}
          </p>
        ) : null}
        {requestIdentity && !manage ? (
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <p>
              A checkout is attached to this saved submission. Return to payment
              below, or close it before making changes.
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={unlockCheckout}
              className="mt-2 font-semibold underline underline-offset-4"
            >
              Close checkout and unlock editing
            </button>
          </div>
        ) : null}
        {step === 1 && !manage && !requestIdentity ? (
          <div className="mb-7 rounded-xl border border-primary/20 bg-earth-sand p-5">
            <label
              htmlFor="workshop-import"
              className="flex items-center gap-2 text-sm font-semibold text-forest"
            >
              <Link2 className="h-4 w-4" />
              Already have a course page?
            </label>
            <p className="mt-2 text-xs leading-relaxed text-earth-brown">
              Paste its public URL to fill available details. Existing entries
              stay intact.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                id="workshop-import"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className={`${inputClass} mt-0`}
                placeholder="https://yourfarm.com/workshops/…"
              />
              <button
                type="button"
                onClick={importDetails}
                disabled={busy || !url}
                className="btn btn-primary shrink-0 disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Import details"
                )}
              </button>
            </div>
          </div>
        ) : null}
        <fieldset
          disabled={busy || Boolean(requestIdentity && !manage)}
          className="space-y-5 disabled:opacity-75"
        >
          {step === 1 ? (
            <>
              {field("title", "Workshop or course title", {
                required: true,
                placeholder: "A clear name for what you teach",
                maxLength: 140,
              })}
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-semibold text-forest">
                  Topic *
                  <select
                    value={fields.topic}
                    onChange={(event) => change("topic", event.target.value)}
                    className={inputClass}
                  >
                    {WORKSHOP_TOPICS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-semibold text-forest">
                  Learning format *
                  <select
                    value={fields.format}
                    onChange={(event) => change("format", event.target.value)}
                    className={inputClass}
                  >
                    {WORKSHOP_FORMATS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-sm font-semibold text-forest">
                Organizer’s time zone *
                <select
                  value={fields.timeZone}
                  onChange={(event) => change("timeZone", event.target.value)}
                  className={inputClass}
                >
                  {Array.from(new Set([...ZONES, fields.timeZone])).map(
                    (zone) => (
                      <option key={zone} value={zone}>
                        {zone.replaceAll("_", " ")}
                      </option>
                    ),
                  )}
                </select>
              </label>
              {fields.format !== "self-paced" ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  {field("start", "Starts (local time)", {
                    type: "datetime-local",
                    required: true,
                  })}
                  {field("end", "Ends (local time)", {
                    type: "datetime-local",
                    hint: "For a multiweek course, use the final session’s end.",
                  })}
                </div>
              ) : (
                <p className="rounded-lg bg-earth-sand p-4 text-sm text-forest-light">
                  Self-paced courses show “Start anytime” and receive up to 60
                  days of promotion.
                </p>
              )}
              {field("closes", "Registration closes (optional)", {
                type: "datetime-local",
                hint: "Promotion ends by this time, the course start, or 60 days after approval—whichever comes first.",
              })}
              {fields.format === "in-person" ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {field("city", "City", { required: true })}
                    <label className="text-sm font-semibold text-forest">
                      State *
                      <select
                        value={fields.state}
                        onChange={(event) =>
                          change("state", event.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="">Choose a state</option>
                        {US_STATES.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  {field("venue", "Venue or farm name", { required: true })}
                  {field("address", "Street address", { required: true })}
                  {field("postalCode", "ZIP code")}
                </>
              ) : null}
            </>
          ) : null}
          {step === 2 ? (
            <>
              {field("summary", "A short introduction", {
                rows: 2,
                required: true,
                maxLength: 240,
                hint: "30–240 characters. This appears on the browse card and in search previews.",
              })}
              {field("description", "About the experience", {
                rows: 6,
                required: true,
                maxLength: 8000,
                hint: "Describe what participants will do. At least 80 characters; plain text is best.",
              })}
              {field("outcomesText", "What participants will learn", {
                rows: 4,
                required: true,
                hint: "Two to eight learning outcomes, one per line.",
              })}
              {field("audience", "Who is it for?", { rows: 2, required: true })}
              <label className="block text-sm font-semibold text-forest">
                Experience level *
                <select
                  value={fields.level}
                  onChange={(event) => change("level", event.target.value)}
                  className={inputClass}
                >
                  {WORKSHOP_LEVELS.map((level) => (
                    <option key={level}>{level}</option>
                  ))}
                </select>
              </label>
              {field("prerequisites", "What to know or bring", { rows: 2 })}
              <div className="grid gap-5 sm:grid-cols-2">
                {field("tuition", "Attendee price (USD)", {
                  type: "number",
                  required: true,
                  hint: "Enter 0 for a free course. This is separate from your $15 listing fee.",
                })}
                {field("priceNotes", "Pricing notes (optional)", {
                  placeholder:
                    "Sliding scale, materials or other ticket options",
                  maxLength: 400,
                })}
              </div>
              {field("scheduleNotes", "Schedule details (optional)", {
                rows: 3,
                hint: "Weekly sessions, estimated time commitment, breaks or recorded access.",
              })}
            </>
          ) : null}
          {step === 3 ? (
            <>
              {field("organization", "Organization or teaching farm", {
                required: true,
                maxLength: 140,
              })}
              {field("instructor", "Instructor (optional)", { maxLength: 160 })}
              {field("managementEmail", "Your management email", {
                type: "email",
                required: true,
                hint: "Private. Your receipt and secure edit link go here. No account or password needed.",
              })}
              {field("organizerWebsite", "Organizer’s website (optional)", {
                type: "url",
                placeholder: "https://yourfarm.com",
              })}
              {field("registrationUrl", "Where should people register?", {
                type: "url",
                required: true,
                placeholder: "https://yourfarm.com/register",
                hint: "Use the public course or ticket page where participants can enroll. You handle course payments and attendee questions.",
              })}
            </>
          ) : null}
        </fieldset>
        {step === 4 && preview ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-[#d9ddcc] bg-earth-cream p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary-dark">
                {fields.organization}
              </p>
              <h3 className="mt-3 font-display text-3xl text-forest">
                {fields.title}
              </h3>
              <p className="mt-4 leading-relaxed text-forest-light">
                {fields.summary}
              </p>
              <div className="my-5 flex flex-wrap gap-2 text-xs text-forest">
                <span className="rounded-full bg-white px-3 py-2">
                  {workshopFormat(fields.format)}
                </span>
                <span className="rounded-full bg-white px-3 py-2">
                  {workshopDate({
                    startAt: preview.startAt,
                    format: fields.format,
                    timeZone: fields.timeZone,
                  })}
                </span>
                <span className="rounded-full bg-white px-3 py-2">
                  {workshopPrice({ tuitionCents: preview.tuitionCents })}{" "}
                  tuition
                </span>
                <span className="rounded-full bg-white px-3 py-2">
                  {fields.level}
                </span>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-forest-light">
                {fields.description}
              </p>
              <h4 className="mt-5 font-semibold text-forest">
                What participants will learn
              </h4>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-forest-light">
                {preview.outcomes.map((outcome, i) => (
                  <li key={i}>{outcome}</li>
                ))}
              </ul>
              <dl className="mt-5 space-y-4 border-t border-border pt-5 text-sm text-forest-light">
                {[
                  ["Who it’s for", fields.audience],
                  ["Before you join", fields.prerequisites],
                  ["Instructor", fields.instructor],
                  [
                    "Location",
                    fields.format === "in-person"
                      ? `${fields.venue}, ${fields.address}, ${fields.city}, ${fields.state} ${fields.postalCode}`
                      : "Online",
                  ],
                  [
                    "Schedule",
                    [
                      fields.start,
                      fields.end ? `to ${fields.end}` : "",
                      fields.timeZone,
                      fields.scheduleNotes,
                    ]
                      .filter(Boolean)
                      .join(" · "),
                  ],
                  ["Registration closes", fields.closes],
                  ["Pricing notes", fields.priceNotes],
                  ["Registration link", fields.registrationUrl],
                  ["Organizer website", fields.organizerWebsite],
                  ["Management email (private)", fields.managementEmail],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-semibold text-forest">{label}</dt>
                      <dd className="mt-1 break-words">{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
            <label className="flex items-start gap-3 rounded-xl border border-primary/20 bg-[#edf3e7] p-4 text-sm leading-relaxed text-forest">
              <input
                type="checkbox"
                checked={reviewed}
                onChange={(event) => setReviewed(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
              />
              <span>
                I am authorized to list this course and have confirmed the
                dates, time zone, tuition and registration link. I agree to the{" "}
                <Link href="/terms#workshops" className="underline">
                  listing terms
                </Link>
                .{" "}
                {manage
                  ? "Changes are reviewed before publication."
                  : "The $15 fee is a one-time promotional listing fee. Publication follows review; rejected listings are refunded. No automatic renewal."}
              </span>
            </label>
          </div>
        ) : null}
        {error ? (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <button
            type="button"
            onClick={() => move(step - 1)}
            disabled={step === 1 || busy}
            className="btn border border-forest/20 text-forest disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => move(step + 1)}
              disabled={busy || !ready}
              className="btn btn-primary"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={busy || !reviewed}
              className="btn btn-primary min-h-12 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {manage
                ? "Submit changes for review"
                : "Pay $15 & submit listing"}
            </button>
          )}
        </div>
      </div>
      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-earth-brown">
        <Sprout className="mt-0.5 h-4 w-4 shrink-0" />
        {manage
          ? "Your management link is private. Keep it somewhere safe."
          : "Your draft stays on this device for up to 30 days. You’ll get a private management link by email after payment."}
      </p>
    </div>
  );
}

export function ClearWorkshopDraft() {
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Storage optional. */
    }
  }, []);
  return null;
}
export function DuplicateWorkshop({ input }: { input: WorkshopInput }) {
  return (
    <button
      className="btn btn-outline"
      onClick={() => {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              fields: {
                ...fieldsFromInput(input),
                start: "",
                end: "",
                closes: "",
              },
              step: 1,
              savedAt: Date.now(),
            }),
          );
          window.location.assign("/post-workshop");
        } catch {
          window.location.assign("/post-workshop");
        }
      }}
    >
      List the next session · $15
    </button>
  );
}
