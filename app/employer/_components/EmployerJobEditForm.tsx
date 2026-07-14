"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, Loader2, Save } from "lucide-react";

import {
  BENEFITS,
  FARM_TYPES,
  JOB_CATEGORIES,
  JOB_TYPES,
  TAGS,
  US_STATES,
} from "@/lib/constants";

export type EditableEmployerJob = {
  id: string;
  slug: string;
  title: string;
  company: string;
  city: string;
  state: string;
  postalCode: string | null;
  remote: boolean;
  description: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryType: string | null;
  jobType: string[];
  farmType: string[];
  categories: string[];
  tags: string[];
  benefits: string[];
  managementEmail: string | null;
  companyWebsite: string | null;
  companyLogo: string | null;
  applyUrl: string | null;
  applyEmail: string | null;
};

type FormState = Omit<EditableEmployerJob, "salaryMin" | "salaryMax"> & {
  salaryMin: string;
  salaryMax: string;
};

type ArrayField = "jobType" | "farmType" | "categories" | "tags" | "benefits";

function Field({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-forest">
        {label}{required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

function CheckboxGroup({
  legend,
  values,
  items,
  onToggle,
}: {
  legend: string;
  values: string[];
  items: ReadonlyArray<{ id: string; label: string }>;
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-forest">{legend}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <label key={item.id} className="flex min-h-11 items-center gap-3 rounded-lg border border-border bg-white px-3 py-2 text-sm text-forest-light">
            <input
              type="checkbox"
              checked={values.includes(item.id)}
              onChange={() => onToggle(item.id)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            {item.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function EmployerJobEditForm({ job }: { job: EditableEmployerJob }) {
  const [form, setForm] = useState<FormState>({
    ...job,
    salaryMin: job.salaryMin == null ? "" : String(job.salaryMin),
    salaryMax: job.salaryMax == null ? "" : String(job.salaryMax),
    salaryType: job.salaryType || "annual",
    postalCode: job.postalCode || "",
    managementEmail: job.managementEmail || "",
    companyWebsite: job.companyWebsite || "",
    companyLogo: job.companyLogo || "",
    applyUrl: job.applyUrl || "",
    applyEmail: job.applyEmail || "",
  });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setNotice(null);
  };

  const toggle = (field: ArrayField, value: string, maximum?: number) => {
    setForm((current) => {
      const selected = current[field];
      if (selected.includes(value)) {
        return { ...current, [field]: selected.filter((item) => item !== value) };
      }
      if (maximum && selected.length >= maximum) return current;
      return { ...current, [field]: [...selected, value] };
    });
    setNotice(null);
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    setError(null);
    try {
      const response = await fetch(`/api/employer/jobs/${encodeURIComponent(job.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          salaryMin: form.salaryMin.trim() ? Number(form.salaryMin) : null,
          salaryMax: form.salaryMax.trim() ? Number(form.salaryMax) : null,
        }),
      });
      const body = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(body.error || "Unable to save this listing.");
      setNotice(body.message || "Listing saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this listing.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-8">
      {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}
      {notice ? <div role="status" className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"><CheckCircle2 className="h-5 w-5 shrink-0" />{notice}</div> : null}

      <section className="card space-y-5 p-6 sm:p-8">
        <h2 className="font-display text-2xl text-forest">Role and location</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Job title" required className="sm:col-span-2"><input required minLength={5} maxLength={100} value={form.title} onChange={(event) => setField("title", event.target.value)} className="input" /></Field>
          <Field label="Farm or company" required className="sm:col-span-2"><input required minLength={2} maxLength={100} value={form.company} onChange={(event) => setField("company", event.target.value)} className="input" /></Field>
          <Field label="City" required><input required value={form.city} onChange={(event) => setField("city", event.target.value)} className="input" /></Field>
          <Field label="State" required><select required value={form.state} onChange={(event) => setField("state", event.target.value)} className="input"><option value="">Select a state</option>{US_STATES.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}</select></Field>
          <Field label="Postal code"><input value={form.postalCode || ""} onChange={(event) => setField("postalCode", event.target.value)} className="input" /></Field>
          <label className="flex min-h-11 items-center gap-3 self-end rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-forest"><input type="checkbox" checked={form.remote} onChange={(event) => setField("remote", event.target.checked)} className="h-4 w-4" />Remote-friendly</label>
        </div>
        <CheckboxGroup legend="Job types *" values={form.jobType} items={JOB_TYPES} onToggle={(value) => toggle("jobType", value)} />
        <CheckboxGroup legend="Categories (up to 3) *" values={form.categories} items={JOB_CATEGORIES} onToggle={(value) => toggle("categories", value, 3)} />
        <CheckboxGroup legend="Operation types *" values={form.farmType} items={FARM_TYPES} onToggle={(value) => toggle("farmType", value)} />
      </section>

      <section className="card space-y-5 p-6 sm:p-8">
        <h2 className="font-display text-2xl text-forest">Job details</h2>
        <Field label="Description" required><textarea required minLength={100} maxLength={5_000} rows={12} value={form.description} onChange={(event) => setField("description", event.target.value)} className="input h-auto resize-y" /></Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Minimum compensation"><input type="number" min="0" step="1" value={form.salaryMin} onChange={(event) => setField("salaryMin", event.target.value)} className="input" /></Field>
          <Field label="Maximum compensation"><input type="number" min="0" step="1" value={form.salaryMax} onChange={(event) => setField("salaryMax", event.target.value)} className="input" /></Field>
          <Field label="Compensation period"><select value={form.salaryType || "annual"} onChange={(event) => setField("salaryType", event.target.value)} className="input"><option value="annual">Annual</option><option value="hourly">Hourly</option></select></Field>
        </div>
        <CheckboxGroup legend="Benefits" values={form.benefits} items={BENEFITS} onToggle={(value) => toggle("benefits", value)} />
        <CheckboxGroup legend="Search tags" values={form.tags} items={TAGS} onToggle={(value) => toggle("tags", value)} />
      </section>

      <section className="card space-y-5 p-6 sm:p-8">
        <h2 className="font-display text-2xl text-forest">Employer and applications</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Private management email" required className="sm:col-span-2"><input type="email" required readOnly autoComplete="email" value={form.managementEmail || ""} className="input bg-gray-50" /><span className="mt-2 block text-xs text-forest-light">This is the signed-in owner. Contact support if the listing needs to be transferred.</span></Field>
          <Field label="Company website"><input type="url" value={form.companyWebsite || ""} onChange={(event) => setField("companyWebsite", event.target.value)} className="input" placeholder="https://yourfarm.com" /></Field>
          <Field label="Company logo URL"><input type="url" value={form.companyLogo || ""} onChange={(event) => setField("companyLogo", event.target.value)} className="input" placeholder="https://yourfarm.com/logo.png" /></Field>
          <Field label="Public application URL"><input type="url" value={form.applyUrl || ""} onChange={(event) => setField("applyUrl", event.target.value)} className="input" placeholder="https://yourfarm.com/jobs/apply" /></Field>
          <Field label="Public application email"><input type="email" value={form.applyEmail || ""} onChange={(event) => setField("applyEmail", event.target.value)} className="input" placeholder="jobs@yourfarm.com" /></Field>
        </div>
        <p className="text-sm text-forest-light">Provide at least one public application URL or email. The private management email is never shown to job seekers.</p>
      </section>

      <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
        <div className="flex flex-wrap gap-3">
          <Link href="/employer" className="btn btn-outline">Cancel</Link>
          <Link href={`/jobs/${job.slug}`} target="_blank" className="btn btn-outline">View listing <ExternalLink className="h-4 w-4" /></Link>
        </div>
        <button type="submit" disabled={saving} className="btn btn-primary justify-center disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving…" : "Save listing"}</button>
      </div>
    </form>
  );
}
