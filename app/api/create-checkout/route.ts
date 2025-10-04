import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PRICING } from "@/lib/constants";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { jobData, plan } = await request.json();

    // Determine price based on plan
    const price = plan === "featured" ? PRICING.FEATURED : PRICING.BASIC;
    const featured = plan === "featured";

    // Create slug
    const slug = slugify(`${jobData.title}-${jobData.company}-${Date.now()}`);

    // Create expiration date (60 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);

    // Create draft job in database
    const job = await db.job.create({
      data: {
        slug,
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        location: jobData.location,
        salaryMin: jobData.salaryMin || null,
        salaryMax: jobData.salaryMax || null,
        salaryType: jobData.salaryType || "annual",
        jobType: jobData.jobType,
        farmType: jobData.farmType,
        categories: jobData.categories,
        tags: jobData.tags || [],
        benefits: jobData.benefits || [],
        companyEmail: jobData.companyEmail,
        companyWebsite: jobData.companyWebsite || null,
        companyLogo: jobData.companyLogo || null,
        applyUrl: jobData.applyUrl || null,
        applyEmail: jobData.applyEmail || null,
        featured,
        active: false, // Will be activated after payment
        expiresAt,
      },
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Job Posting - ${plan === "featured" ? "Featured" : "Basic"}`,
              description: `${jobData.title} at ${jobData.company}`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&job_id=${job.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/post-job/preview`,
      metadata: {
        jobId: job.id,
        plan,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
