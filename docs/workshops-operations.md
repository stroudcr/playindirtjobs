# Workshops operations

Workshops are a separate product from job postings. A promotion costs $15 USD once, lasts up to 60 days from first approval, and closes earlier at registration close or the first session. Attendee tuition is separate and is paid on the organizer’s website. No organizer account or automatic renewal is required.

## Initial complimentary listings

`prisma/workshop-seed-data.ts` contains ten courses from Oregon State University, Cornell Small Farms, Market Gardener Institute, Pasa Sustainable Agriculture, and Tilth Alliance. Each links to its original registration page and has an original description, verified September 5, 2026. `GIFTED` marks free promotion, not free tuition. Seed records have no organizer email, payment order, or outgoing notification. Gifts receive the same relevant placements as paid listings and are excluded from paid revenue.

Run `npx prisma migrate deploy` against the intended database, then `npm run workshops:seed` with its DATABASE_URL loaded. The seed command reads `.env` but preserves an explicitly supplied environment variable. It skips existing slugs without extending a gift. Reverify dated courses before running it at a later date. Never use `prisma db push` or a reset on production.

## Owner workflow

Open `/admin/workshops` through the existing passwordless employer login, using an address in `ADMIN_EMAILS`. A successful email verification assigns the admin role. The workshop review includes the registration destination, content, tuition, schedule, and organizer identity. Approve to publish, or give a rejection reason to request a full listing-fee refund. Interrupted refunds remain held and can be retried with the same Stripe idempotency key.

For a gifted listing, verify the organizer’s mailbox before selecting **Assign & send private link**. This explicit action emails the gift and management link. Do not guess organizer email addresses. Owners can edit, mark full, cancel, or duplicate into a new paid submission using that link. Edits require review again and preserve the original promotion deadline.

## Payments, expiry, and reporting

The existing Stripe webhook `/api/stripe-webhook` routes workshop metadata separately from job purchases. Required events are `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, and `charge.refunded`. Exact USD amount, order, session, and workshop identity are checked before queuing review. No public listing is created by the success-page visit alone.

The existing daily `/api/cron/employer-operations` cron expires listings and queues deduplicated weekly/final reports through the email outbox. `CRON_SECRET`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`, `DATABASE_URL`, and `ADMIN_EMAILS` must be set. Reports contain accepted course-page views and registration-link clicks, not claimed enrollments. Check the admin queue each business day; the posting flow promises review normally within one business day.

## Search and privacy

The SSR directory and public detail pages have canonical URLs, unique metadata, breadcrumbs, Course/EducationEvent JSON-LD and a dedicated XML sitemap. Filter combinations and closed detail pages are noindex. Private draft/payment/management pages have noindex and restrictive referrer headers; email addresses, tokens, and order records are excluded from public DTOs. Expired listings are excluded from recommendations, structured event data and the active sitemap.

## Verification

Use Node 22. Run `npm test`, `npm run typecheck`, `npm run build`, and `npm run test:e2e`. Browser tests cover desktop and mobile, filters, SEO, accountless posting/import/draft recovery and the existing employer flow. External checkout is mocked in browser tests; payment settlement is tested separately with signed synthetic Stripe events on an isolated development schema. Never send synthetic webhooks to production or charge a live card for QA.
