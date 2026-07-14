import Stripe from "stripe";

// Use a placeholder key during build if not set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-06-24.dahlia",
  typescript: true,
});
