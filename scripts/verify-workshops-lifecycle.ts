import assert from "node:assert/strict";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { workshopSeeds } from "../prisma/workshop-seed-data";
import { workshopSchema } from "../lib/workshop-validation";

// This exercises actual route handlers and database writes, only in a dedicated
// development schema with unusable email/payment credentials. No live charges.
assert.equal(
  new URL(process.env.DATABASE_URL!).searchParams.get("schema"),
  "workshops_dev_20260905",
);
assert.equal(process.env.RESEND_API_KEY, "re_local_placeholder");
assert.equal(process.env.STRIPE_SECRET_KEY, "sk_test_placeholder");
const origin = "http://127.0.0.1:3100";
const db = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const id = randomUUID(),
  token = randomBytes(32).toString("base64url");
const adminToken = randomBytes(32).toString("base64url");
const slug = `qa-workshop-lifecycle-${id}`;
const eventIds: string[] = [];
const email = `qa.receipt.${id}@example.test`;
let employerId: string | undefined;
const input = workshopSchema.parse({
  ...workshopSeeds[0],
  title: "QA workshop lifecycle",
  managementEmail: email,
});
async function request(
  path: string,
  body: unknown,
  auth: "admin" | "owner" | "public" = "admin",
  method = "POST",
) {
  return fetch(origin + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      "User-Agent": "Mozilla/5.0",
      ...(auth === "admin"
        ? { Cookie: `pidj_employer_session=${adminToken}` }
        : auth === "owner"
          ? { Authorization: `Bearer ${token}` }
          : {}),
    },
    body: JSON.stringify(body),
  });
}
async function webhook(type: string, object: unknown, reuseId?: string) {
  const eventId = reuseId ?? `evt_qa_${randomUUID()}`;
  eventIds.push(eventId);
  const payload = JSON.stringify({
    id: eventId,
    object: "event",
    type,
    data: { object },
  });
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: process.env.STRIPE_WEBHOOK_SECRET!,
  });
  const response = await fetch(origin + "/api/stripe-webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Stripe-Signature": signature,
    },
    body: payload,
  });
  assert.equal(response.status, 200, await response.text());
  return eventId;
}
async function main() {
  try {
    const admin = await db.employer.upsert({
      where: { email: "qa.admin@example.test" },
      update: { role: "ADMIN" },
      create: {
        email: "qa.admin@example.test",
        role: "ADMIN",
        emailVerifiedAt: new Date(),
      },
    });
    employerId = admin.id;
    await db.authSession.create({
      data: {
        employerId: admin.id,
        tokenHash: createHash("sha256").update(adminToken).digest("hex"),
        expiresAt: new Date(Date.now() + 3600000),
      },
    });
    const workshop = await db.workshop.create({
      data: {
        ...input,
        id,
        slug,
        editToken: token,
        status: "DRAFT",
        origin: "PAID",
        order: {
          create: { snapshot: input, stripeCheckoutSessionId: `cs_qa_${id}` },
        },
      },
      include: { order: true },
    });
    const order = workshop.order!;
    const metadata = {
      product: "workshop",
      workshopOrderId: order.id,
      workshopId: id,
    };
    const checkout = {
      id: order.stripeCheckoutSessionId,
      object: "checkout.session",
      status: "complete",
      mode: "payment",
      payment_status: "paid",
      currency: "usd",
      amount_total: 1500,
      amount_subtotal: 1500,
      client_reference_id: order.id,
      payment_intent: `pi_qa_${id}`,
      metadata,
    };
    const firstEvent = await webhook("checkout.session.completed", checkout);
    await webhook("checkout.session.completed", checkout, firstEvent);
    assert.equal(
      (await db.workshop.findUniqueOrThrow({ where: { id } })).status,
      "PENDING_REVIEW",
    );
    assert.equal(
      await db.emailOutbox.count({
        where: { deduplicationKey: `${order.id}:workshop-receipt` },
      }),
      1,
    );
    const unpublished = await (
      await fetch(origin + `/workshops/${slug}`)
    ).text();
    assert.match(
      unpublished,
      /NEXT_HTTP_ERROR_FALLBACK;404|could not be found|Page Not Found/i,
    );
    assert.ok(
      !unpublished.includes(input.title) && !unpublished.includes(email),
    );
    const approvals = await Promise.all([
      request(`/api/admin/workshops/${id}`, { action: "approve" }),
      request(`/api/admin/workshops/${id}`, { action: "approve" }),
    ]);
    assert.deepEqual(approvals.map((r) => r.status).sort(), [200, 409]);
    const published = await db.workshop.findUniqueOrThrow({ where: { id } });
    assert.equal(published.status, "PUBLISHED");
    const page = await fetch(origin + `/workshops/${slug}`);
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.ok(!html.includes(token) && !html.includes(email));
    assert.equal(
      (await fetch(origin + `/manage/workshops/${token}`)).status,
      200,
    );
    assert.equal(
      (
        await request(
          `/api/workshops/manage/${id}`,
          { workshop: { ...input, title: "QA updated workshop" } },
          "owner",
          "PATCH",
        )
      ).status,
      200,
    );
    assert.equal(
      (await db.workshop.findUniqueOrThrow({ where: { id } })).status,
      "PENDING_REVIEW",
    );
    assert.equal(
      (await request(`/api/admin/workshops/${id}`, { action: "approve" }))
        .status,
      200,
    );
    assert.equal(
      (
        await db.workshop.findUniqueOrThrow({ where: { id } })
      ).expiresAt?.toISOString(),
      published.expiresAt?.toISOString(),
    );
    assert.equal(
      (
        await request(
          `/api/workshops/manage/${id}`,
          { action: "sold_out" },
          "owner",
        )
      ).status,
      200,
    );
    assert.equal(
      (await db.workshop.findUniqueOrThrow({ where: { id } })).status,
      "SOLD_OUT",
    );
    assert.equal(
      (
        await request(
          `/api/workshops/manage/${id}`,
          { action: "reopen" },
          "owner",
        )
      ).status,
      200,
    );
    assert.equal(
      (await request(`/api/admin/workshops/${id}`, { action: "approve" }))
        .status,
      200,
    );
    const event = {
      workshopId: id,
      eventName: "workshop_registration_click",
      source: "detail",
      visitor: randomUUID(),
    };
    await request("/api/workshops/events", event, "public");
    await request("/api/workshops/events", event, "public");
    assert.equal(
      await db.workshopEvent.count({
        where: { workshopId: id, eventName: event.eventName },
      }),
      1,
    );
    await webhook("charge.refunded", {
      object: "charge",
      metadata,
      amount: 1500,
      amount_refunded: 1500,
      refunded: true,
      payment_intent: checkout.payment_intent,
    });
    assert.equal(
      (await db.workshop.findUniqueOrThrow({ where: { id } })).status,
      "REJECTED",
    );
    assert.equal(
      (await db.workshopOrder.findUniqueOrThrow({ where: { id: order.id } }))
        .status,
      "REFUNDED",
    );
    await webhook("checkout.session.completed", checkout);
    assert.equal(
      (await db.workshop.findUniqueOrThrow({ where: { id } })).status,
      "REJECTED",
    );
    assert.equal(
      (
        await request(
          `/api/workshops/manage/${id}`,
          { workshop: input },
          "owner",
          "PATCH",
        )
      ).status,
      409,
    );
    assert.equal(
      (await request(`/api/admin/workshops/${id}`, { action: "approve" }))
        .status,
      409,
    );
    console.log(
      "PASS: signed payment, duplicate receipt prevention, private draft, concurrent review, publication, private management, edit/review deadline, sold-out/reopen, deduplicated referrals, refund and delayed-event protection.",
    );
  } finally {
    await db.emailOutbox.deleteMany({ where: { recipient: email } });
    await db.workshopOrder.deleteMany({ where: { workshopId: id } });
    await db.workshop.deleteMany({ where: { id } });
    await db.stripeEvent.deleteMany({ where: { id: { in: eventIds } } });
    if (employerId)
      await db.authSession.deleteMany({
        where: {
          employerId,
          tokenHash: createHash("sha256").update(adminToken).digest("hex"),
        },
      });
    await db.$disconnect();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
