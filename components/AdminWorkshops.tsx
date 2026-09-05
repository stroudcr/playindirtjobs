"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function AdminWorkshopActions({
  id,
  pending,
  giftedUnassigned,
  rejecting = false,
}: {
  id: string;
  pending: boolean;
  giftedUnassigned: boolean;
  rejecting?: boolean;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function act(action: string) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/workshops/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note, email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.refresh();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mt-5 space-y-3">
      {pending || rejecting ? (
        <>
          <button
            disabled={busy || rejecting}
            onClick={() => act("approve")}
            className="btn btn-primary"
          >
            Approve &amp; publish
          </button>
          <details>
            <summary className="cursor-pointer text-sm text-red-800">
              Reject and refund listing fee
            </summary>
            <label className="mt-3 block text-sm text-forest">
              Reason for organizer
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="mt-2 w-full rounded border border-border p-3"
              />
            </label>
            <button
              disabled={busy || note.trim().length < 5}
              onClick={() => act("reject")}
              className="btn border border-red-200 text-red-800 disabled:opacity-40"
            >
              Reject &amp; request refund
            </button>
          </details>
        </>
      ) : null}
      {giftedUnassigned ? (
        <details>
          <summary className="cursor-pointer text-sm font-semibold text-primary">
            Assign verified organizer and email management link
          </summary>
          <p className="mt-2 text-xs text-earth-brown">
            Verify this person represents the organization before assigning
            ownership. This action sends the complimentary-listing email.
          </p>
          <label className="mt-3 block text-sm text-forest">
            Verified organizer email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded border border-border p-3"
            />
          </label>
          <button
            disabled={busy || !email}
            onClick={() => act("assign_owner")}
            className="btn btn-outline mt-3"
          >
            Assign &amp; send private link
          </button>
        </details>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
