"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MailCheck, Plus } from "lucide-react";

interface Lead {
  id: string;
  email: string | null;
  name: string | null;
  company: string | null;
  source: string | null;
  status: string;
}

interface Message {
  id: string;
  recipient: string;
  subject: string;
  template: string;
  status: string;
  leadLabel: string;
  createdAt: string;
}

export function AdminGrowthOperations({ leads, messages, outreachConfigured }: { leads: Lead[]; messages: Message[]; outreachConfigured: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState(leads.find((lead) => lead.email)?.id ?? "");

  const submit = async (endpoint: string, body?: unknown) => {
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Operation failed.");
      setNotice("Saved.");
      router.refresh();
      return true;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Operation failed.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const addLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const success = await submit("/api/admin/leads", Object.fromEntries(form.entries()));
    if (success) event.currentTarget.reset();
  };

  const addMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await submit("/api/admin/outreach", Object.fromEntries(form.entries()));
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <section className="card p-5 sm:p-6">
        <h2 className="text-xl font-display text-forest">Lead and partnership queue</h2>
        <form onSubmit={addLead} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input name="company" className="input" placeholder="Organization" />
          <input name="name" className="input" placeholder="Contact name" />
          <input name="email" type="email" className="input" placeholder="Work email" />
          <select name="source" className="input" defaultValue="manual">
            <option value="manual">Manual prospect</option>
            <option value="imported_listing">Imported listing</option>
            <option value="partner">Association / partner</option>
            <option value="bulk_inquiry">Bulk inquiry</option>
            <option value="employer_landing">Employer landing page</option>
          </select>
          <input name="sourceUrl" type="url" className="input sm:col-span-2" placeholder="Source URL (optional)" />
          <textarea name="notes" className="input min-h-24 sm:col-span-2" placeholder="Context and next action" />
          <button disabled={busy} className="btn btn-primary justify-center sm:col-span-2"><Plus className="h-4 w-4" /> Add lead</button>
        </form>
        <div className="mt-6 max-h-80 space-y-2 overflow-auto">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center justify-between gap-3"><strong className="text-forest">{lead.company || lead.name || lead.email}</strong><span className="text-xs text-forest-light">{lead.status}</span></div>
              <p className="mt-1 text-forest-light">{lead.email || "No email"} · {lead.source || "unknown source"}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-xl font-display text-forest">Human-approved outreach</h2>
        {!outreachConfigured ? <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Sending remains disabled until postal-address and unsubscribe-secret environment variables are configured.</p> : null}
        <form onSubmit={addMessage} className="mt-4 space-y-3">
          <select name="leadId" className="input" value={selectedLead} onChange={(event) => setSelectedLead(event.target.value)} required>
            <option value="">Select a lead with email</option>
            {leads.filter((lead) => lead.email).map((lead) => <option key={lead.id} value={lead.id}>{lead.company || lead.name || lead.email}</option>)}
          </select>
          <select name="template" className="input" defaultValue="seasonal_hiring">
            <option value="claim_listing">Claim imported listing</option>
            <option value="seasonal_hiring">Seasonal hiring</option>
            <option value="partnership_intro">Partnership introduction</option>
          </select>
          <input name="subject" className="input" placeholder="Subject" required />
          <textarea name="message" className="input min-h-36" placeholder="Plain-text message. Review the source and relevance before approving." required />
          <button disabled={busy} className="btn btn-primary w-full justify-center">Save as draft</button>
        </form>
        <div className="mt-6 max-h-96 space-y-2 overflow-auto">
          {messages.map((message) => (
            <div key={message.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex items-start justify-between gap-3"><div><strong className="text-forest">{message.subject}</strong><p className="mt-1 text-xs text-forest-light">{message.leadLabel} · {message.template.replaceAll("_", " ")}</p></div><span className="text-xs font-semibold text-forest-light">{message.status}</span></div>
              {message.status === "DRAFT" ? <button disabled={busy || !outreachConfigured} onClick={() => void submit(`/api/admin/outreach/${message.id}/approve`)} className="btn btn-outline mt-3 w-full justify-center text-sm"><MailCheck className="h-4 w-4" /> Review complete — approve and send</button> : null}
            </div>
          ))}
        </div>
        {notice ? <p className="mt-4 text-sm text-forest-light" aria-live="polite">{busy ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : null}{notice}</p> : null}
      </section>
    </div>
  );
}
