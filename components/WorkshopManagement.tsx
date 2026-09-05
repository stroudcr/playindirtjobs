"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function WorkshopManagement({
  id,
  token,
  status,
}: {
  id: string;
  token: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function act(action: string) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/workshops/manage/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
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
    <div>
      <div className="flex flex-wrap gap-3">
        {status === "PUBLISHED" ? (
          <button
            disabled={busy}
            className="btn btn-outline"
            onClick={() => act("sold_out")}
          >
            Mark full
          </button>
        ) : null}
        {["PUBLISHED", "SOLD_OUT"].includes(status) ? (
          <button
            disabled={busy}
            className="btn border border-red-200 bg-white text-red-800"
            onClick={() => act("cancel")}
          >
            Cancel workshop
          </button>
        ) : null}
        {["SOLD_OUT", "CANCELED"].includes(status) ? (
          <button
            disabled={busy}
            className="btn btn-outline"
            onClick={() => act("reopen")}
          >
            Request reopening
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="mt-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
