# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PlayInDirtJobs is a Next.js 15 job board for sustainable agriculture (farming, gardening, ranching). The app uses a no-authentication model where job management happens via magic links sent by email after Stripe payment.

**Key Technologies:**
- Next.js 15 (App Router) with TypeScript
- PostgreSQL + Prisma ORM
- Stripe for payments
- Resend for emails
- TailwindCSS with custom solarpunk theme

## Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on port 3000)
npm run dev

# Database operations
npx prisma migrate dev --name <migration_name>  # Create and run migration
npx prisma generate                              # Generate Prisma client
npx prisma studio                                # Open database GUI
npm run db:seed                                  # Seed database with sample data

# Build and production
npm run build                                     # Builds: prisma generate → prisma migrate deploy → next build
npm start                                         # Start production server

# Linting
npm run lint

# Stripe webhook forwarding (for local development)
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

## Architecture

### Core Flow: Job Posting

1. **Job Creation** (`/post-job`): User fills form → proceeds to Stripe checkout
2. **Stripe Checkout** (`/api/create-checkout`): Creates Stripe session + inactive Job record with `editToken`
3. **Webhook** (`/api/stripe-webhook`): On `checkout.session.completed` → activates Job + sends email with magic link
4. **Management**: User receives email with `editToken` link to manage their job (future feature)

### Database Schema

Two main models in `prisma/schema.prisma`:

**Job**
- Slug-based URLs for SEO (`/jobs/[slug]`)
- `editToken` for passwordless management
- `featured` boolean for paid placement
- `active` boolean (only set after payment)
- Arrays for categories, jobType, farmType, benefits, tags
- 60-day expiration via `expiresAt`

**Subscriber**
- Email subscriptions for job alerts
- Category filtering support

### Key Data Structures

All constants defined in `lib/constants.ts`:
- `JOB_CATEGORIES`: 14 categories with emojis (farm-hand, gardener, ranch-hand, etc.)
- `JOB_TYPES`: full-time, part-time, seasonal, apprenticeship, etc.
- `FARM_TYPES`: organic, permaculture, regenerative, biodynamic, etc.
- `BENEFITS`: housing, meals, equipment, learning, etc.
- `PRICING`: Basic ($5 / 500 cents), Featured ($15 / 1500 cents), Bundle ($199 / 19900 cents)
- Pricing is stored in **cents**. Use `(PRICING.BASIC / 100).toFixed(0)` to display dollar amounts.

Validation schemas in `lib/validations.ts` using Zod.

### API Routes

- `POST /api/create-checkout`: Creates Stripe session + inactive Job record
- `POST /api/stripe-webhook`: Handles payment completion, activates jobs
- `GET /api/jobs`: Lists jobs with filtering/sorting
- `GET /api/jobs/[id]`: Individual job details
- `POST /api/subscribe`: Email subscription signup (Zod validated)
- `DELETE /api/subscribe`: Unsubscribe by email (Zod validated)

### Email System

`lib/email.ts` uses Resend API:
- `sendJobConfirmationEmail()`: Sent after payment with magic link
- `sendJobAlertEmail()`: For subscriber notifications
- Configure `FROM_EMAIL` before production deployment

### Environment Variables

Required in `.env`:
```
DATABASE_URL              # PostgreSQL connection string
STRIPE_SECRET_KEY         # Stripe secret key
STRIPE_WEBHOOK_SECRET     # From Stripe CLI or dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY
NEXT_PUBLIC_APP_URL       # e.g., http://localhost:3000
BASIC_JOB_PRICE=500       # In cents ($5)
FEATURED_JOB_PRICE=1500   # In cents ($15)
```

See `.env.example` for full reference.

### Styling and Theme

Professional design system in `tailwind.config.ts`:
- Primary green: `#10b981`
- Clean neutrals: `earth.cream` (`#fafaf8`), `earth.sand` (`#f5f5f0`), `border` (`#e5e5e5`)
- Neutral layered shadows (`soft`, `soft-lg`, `soft-xl`) — no green tint
- Two font families: `font-sans` (Inter) for body, `font-display` (DM Serif Display) for headings
- DM Serif Display loaded via `next/font/google` in `app/layout.tsx` with CSS variable `--font-dm-serif-display`
- CSS animations: `fade-in-up`, `fade-in`, `slide-in-right`, `.animate-stagger` (nth-child delays)
- Custom CSS classes: `.btn`, `.btn-outline`, `.card`, `.input` in `app/globals.css`
- Hero sections use `bg-gradient-to-b from-white to-earth-sand` (consistent across all pages)
- Featured jobs: left accent bar + pill badge with dot indicator (not solid bg badge)
- JobCard/LiveJobPreview: company initial avatar with deterministic color hash

### Component Structure

**Page Components:**
- `/` - Homepage: **server component** fetches jobs via Prisma for SEO, delegates interactive filtering to `HomeClient`
- `/post-job` - Job posting form with live preview
- `/jobs/[slug]` - Individual job detail page (uses React `cache()` to deduplicate `getJob` between `generateMetadata` and page)
- `/success` - Post-payment success page
- Category pages: `/farming-jobs`, `/gardening-jobs`, `/ranch-jobs`, etc.
- State pages: `/california-jobs`, `/texas-jobs`, etc.

**Reusable Components:**
- `HomeClient` - Client wrapper for homepage interactive filtering (receives SSR initial jobs, fetches via `/api/jobs` on filter change, syncs filters to URL params). Uses skeleton cards for loading state.
- `JobCard` - Job listing card with company avatar, featured accent bar, `font-display` title
- `FilterSidebar` / `MobileFilters` - Filtering UI (chevron icons, refined sort styling)
- `MobileNav` - Hamburger navigation for mobile (client component, overlay pattern)
- `SearchBar` - Search functionality (accepts optional `initialQuery` prop, visible search button)
- `LiveJobPreview` - Real-time preview in job posting form (mirrors JobCard styling)
- `PlanSelector` - Pricing plan selection
- `EmailSubscribe` - Newsletter signup (gradient background treatment)
- `Header` - Glassmorphism header (`bg-white/90 backdrop-blur-md`) with desktop nav links + MobileNav
- `Footer` - Gradient accent bar, 4-column link grid, bottom bar with Terms/Privacy/Contact

## Important Patterns

### Slug Generation
Jobs use slugified titles for URLs. Ensure unique slugs when creating jobs (append random string if needed).

### Magic Link Authentication
No traditional auth system. Job management URLs include `editToken` query param:
```
/manage/[editToken]
```
**Note:** Management UI is in TODO list and not yet implemented.

### Server vs Client Components
- Most pages are Server Components for SEO
- Homepage uses a **hybrid SSR pattern**: `app/page.tsx` is a server component that fetches initial jobs via Prisma, then passes them to `HomeClient` (client component) for interactive filtering. This ensures job listings appear in initial HTML for SEO while preserving snappy client-side filter UX.
- Job detail page uses React `cache()` on `getJob()` to deduplicate the Prisma query between `generateMetadata` and the page component. View increment runs only in the page component (not metadata).
- Forms and interactive UI use `"use client"` directive
- API routes handle all mutations
- `formatSalary()` in `lib/utils.ts` takes `number | undefined` (not `null`) — use `?? undefined` when passing Prisma nullable fields

### Stripe Integration
- Use test mode keys in development
- Webhook signature verification is required
- Store `stripePaymentId` on Job for payment tracking
- Jobs remain inactive until webhook confirms payment

## Testing Stripe Locally

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
4. Copy webhook secret to `.env`
5. Test with card: `4242 4242 4242 4242`

## Design Conventions

When adding new pages or components, follow these patterns:
- **Headings** (h1, h2, h3): Use `font-display` class (DM Serif Display serif font)
- **Hero sections**: `bg-gradient-to-b from-white to-earth-sand border-b border-border`
- **Featured badges**: Pill with dot indicator: `<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"><span className="w-1.5 h-1.5 bg-primary rounded-full" />Featured</span>`
- **Category tags**: `bg-primary/5 text-primary` — Job type tags: `bg-gray-100 text-forest-light`
- **Section backgrounds**: Use `bg-gray-50` for alternate sections (not `bg-forest/5`)
- **Card hover**: `hover:shadow-soft-lg hover:border-gray-300` with `group` transition
- **Apply/CTA buttons**: `bg-gradient-to-r from-primary to-primary-dark` for high-emphasis

## SEO Infrastructure

### URL Helpers
- `getBaseUrl()` and `getUrl(path)` in `lib/metadata.ts` — always use these for canonical URLs, OG urls, and JSON-LD URLs. Never hardcode `https://playindirtjobs.com`.
- `getBaseUrl()` returns the base domain (from `NEXT_PUBLIC_APP_URL` or production fallback)
- `getUrl("about")` returns full URL like `https://playindirtjobs.com/about`

### Structured Data (JSON-LD)
- **Organization** — root layout (`app/layout.tsx`)
- **WebSite + SearchAction** — root layout, enables sitelinks search box in Google SERPs
- **JobPosting** — job detail pages (`app/jobs/[slug]/page.tsx`), comprehensive schema
- **FAQPage** — all 50 state pages + `/faq` page
- **BreadcrumbList** — `components/Breadcrumbs.tsx`, auto-generated from items prop
- **AboutPage** — `/about` page
- **Product** — `/pricing` page (offers for Basic and Featured listings)

### Sitemap & Robots
- Dynamic sitemap at `app/sitemap.ts` — includes homepage, category pages, state pages, active jobs, about, pricing, contact, terms, privacy, FAQ
- `robots.txt` with multi-bot rules

### Metadata Patterns
- All pages should have: `title`, `description`, `openGraph` (with `siteName`, `locale`, `type`, `images`), `twitter` card, `alternates.canonical`
- Category pages and state pages include OG images and Twitter cards
- State pages use Unsplash hero images for OG; category pages use `/images/PlayInDirtX.png`
- Terms and privacy pages have `robots: { index: true, follow: true }` plus canonicals

### Breadcrumbs
- `Breadcrumbs` component handles both visual breadcrumbs and BreadcrumbList JSON-LD
- Uses `getBaseUrl()` for JSON-LD item URLs (not hardcoded)
- `variant="light"` for white text on dark backgrounds (state page heroes)

## Known Limitations / TODOs

From README:
- Job management dashboard (edit/deactivate via magic link) - not yet implemented
- Advanced analytics for job posters
- Map view for job locations
- Saved jobs for job seekers
- Company profiles
- Job application tracking

## Deployment

Recommended: Vercel
- Push to GitHub
- Import to Vercel
- Set all environment variables from `.env`
- Vercel auto-runs build command which includes Prisma migrations

Build process automatically runs:
1. `prisma generate`
2. `prisma migrate deploy`
3. `next build`
