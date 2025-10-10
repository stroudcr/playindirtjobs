import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendJobConfirmationEmail, sendReceiptEmail } from "@/lib/email";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const jobId = session.metadata.jobId;
    const plan = session.metadata.plan;

    if (jobId) {
      try {
        // Activate the job and store payment ID
        const job = await db.job.update({
          where: { id: jobId },
          data: {
            active: true,
            stripePaymentId: session.payment_intent,
          },
        });

        console.log(`Job ${jobId} activated successfully`);

        // Send receipt email first
        await sendReceiptEmail(job.companyEmail, {
          jobTitle: job.title,
          company: job.company,
          plan: plan || "basic",
          amount: session.amount_total,
          transactionId: session.payment_intent || session.id,
          date: new Date(),
        });

        // Send email confirmation with magic link
        await sendJobConfirmationEmail(job.companyEmail, {
          id: job.id,
          title: job.title,
          company: job.company,
          slug: job.slug,
          editToken: job.editToken,
        });
      } catch (error) {
        console.error("Error activating job:", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
