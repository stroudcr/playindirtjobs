import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";
import { db } from "@/lib/db";
import { ClearWorkshopDraft } from "@/components/WorkshopWizard";
import { WorkshopPaymentStatus } from "@/components/WorkshopPaymentStatus";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Workshop submission | PlayInDirtJobs",
  robots: { index: false, follow: false },
};
export default async function WorkshopSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const order =
    typeof session_id === "string" &&
    /^cs_[a-zA-Z0-9_]{10,250}$/.test(session_id)
      ? await db.workshopOrder.findUnique({
          where: { stripeCheckoutSessionId: session_id },
          select: {
            status: true,
            workshop: { select: { title: true, status: true, slug: true } },
          },
        })
      : null;
  const paid = order?.status === "PAID";
  return (
    <main className="min-h-screen bg-earth-cream px-5 py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-primary/20 bg-white p-7 text-center sm:p-10">
        {paid ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        ) : (
          <Clock3 className="mx-auto h-12 w-12 text-primary" />
        )}
        <h1 className="mt-5 font-display text-4xl text-forest">
          {paid
            ? "Thank you for sharing your skills."
            : "Workshop payment status"}
        </h1>
        {paid ? (
          <>
            <ClearWorkshopDraft />
            <p className="mt-5 leading-relaxed text-forest-light">
              Your $15 payment for <strong>{order.workshop.title}</strong> is
              confirmed.{" "}
              {order.workshop.status === "PUBLISHED"
                ? "Your listing is live."
                : "We’ll review your listing, normally within one business day, and email you when it is live."}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-forest-light">
              Your receipt and private management link are sent to the email you
              provided. There is no automatic renewal.
            </p>
          </>
        ) : order?.status === "PENDING" ? (
          <WorkshopPaymentStatus />
        ) : (
          <p className="mt-4 text-forest-light">
            {order
              ? "This checkout is no longer active."
              : "We couldn’t find this checkout. Please check your confirmation email or contact us."}
          </p>
        )}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/workshops" className="btn btn-primary">
            Explore workshops
          </Link>
          <Link href="/contact" className="btn btn-outline">
            Get help
          </Link>
        </div>
      </div>
    </main>
  );
}
