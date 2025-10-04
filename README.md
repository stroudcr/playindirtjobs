# 🌱 PlayInDirtJobs

A modern job board for farming, gardening, and ranching opportunities. Built with Next.js 15, featuring a cheerful solarpunk aesthetic and seamless Stripe integration for job postings.

## ✨ Features

- **Beautiful Solarpunk Design** - Vibrant greens, earthy tones, and nature-themed emojis
- **Advanced Filtering** - Search by category, job type, farm type, benefits, and more
- **No Authentication Required** - Post jobs and manage them via magic links
- **Stripe Integration** - Secure payment processing for job postings ($99 basic, $249 featured)
- **Email Notifications** - Job alerts and management links via Resend
- **SEO Optimized** - Server-side rendering for better search visibility
- **Responsive Design** - Beautiful on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS with custom solarpunk theme
- **Database:** PostgreSQL with Prisma ORM
- **Payments:** Stripe
- **Email:** Resend
- **Icons:** Lucide React
- **Hosting:** Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account
- Resend account (for emails)

## 🚀 Getting Started

### 1. Clone the repository

\`\`\`bash
git clone <your-repo-url>
cd playindirtjobs
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables

Create a \`.env\` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/playindirtjobs?schema=public"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Job Pricing (in cents)
BASIC_JOB_PRICE=9900
FEATURED_JOB_PRICE=24900
\`\`\`

### 4. Set up the database

\`\`\`bash
# Run Prisma migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
\`\`\`

### 5. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Stripe Setup

### Development Mode

1. Get your test API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Install Stripe CLI: \`brew install stripe/stripe-cli/stripe\`
3. Login to Stripe CLI: \`stripe login\`
4. Forward webhooks to your local server:
   \`\`\`bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   \`\`\`
5. Copy the webhook signing secret to your \`.env\` file

### Production Mode

1. Get your live API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Create a webhook endpoint in Stripe Dashboard:
   - URL: \`https://yourdomain.com/api/stripe-webhook\`
   - Events: \`checkout.session.completed\`
3. Copy the webhook signing secret to your production environment variables

## 📧 Email Setup (Resend)

1. Sign up at [Resend](https://resend.com)
2. Verify your domain (or use their test domain for development)
3. Get your API key and add it to \`.env\`
4. Update the \`FROM_EMAIL\` in \`lib/email.ts\` to match your verified domain

## 🗄️ Database Schema

The app uses two main models:

- **Job** - Job postings with all details, payment info, and management tokens
- **Subscriber** - Email subscribers for job alerts

See \`prisma/schema.prisma\` for the complete schema.

## 📁 Project Structure

\`\`\`
playindirtjobs/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── jobs/           # Job listing and individual job APIs
│   │   ├── create-checkout/ # Stripe checkout session
│   │   ├── stripe-webhook/  # Stripe webhook handler
│   │   └── subscribe/       # Email subscription
│   ├── jobs/[slug]/        # Job detail pages
│   ├── post-job/           # Job posting form and preview
│   ├── success/            # Payment success page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── JobCard.tsx
│   ├── FilterSidebar.tsx
│   ├── SearchBar.tsx
│   └── EmailSubscribe.tsx
├── lib/                     # Utility functions
│   ├── db.ts               # Prisma client
│   ├── stripe.ts           # Stripe configuration
│   ├── email.ts            # Email functions
│   ├── constants.ts        # App constants
│   ├── validations.ts      # Zod schemas
│   └── utils.ts            # Helper functions
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Static assets
\`\`\`

## 🎨 Customization

### Colors

Edit the solarpunk color scheme in \`tailwind.config.ts\`:

\`\`\`typescript
colors: {
  primary: "#10b981",      // Vibrant green
  secondary: "#d97706",    // Earth tone
  accent: {
    yellow: "#fbbf24",     // Sunny yellow
    blue: "#38bdf8",       // Sky blue
  },
  // ... more colors
}
\`\`\`

### Job Categories

Edit categories, farm types, and benefits in \`lib/constants.ts\`:

\`\`\`typescript
export const JOB_CATEGORIES = [
  { id: "farm-hand", label: "Farm Hand", emoji: "🌾" },
  // Add more categories
];
\`\`\`

### Pricing

Update pricing in \`lib/constants.ts\` and your \`.env\` file:

\`\`\`typescript
export const PRICING = {
  BASIC: 9900,      // $99
  FEATURED: 24900,  // $249
};
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all variables from \`.env.example\` in your Vercel dashboard, using production values for Stripe and Resend.

## 📝 TODO / Future Enhancements

- [ ] Job management dashboard (edit/deactivate via magic link)
- [ ] Advanced analytics for job posters
- [ ] Social sharing for job posts
- [ ] Map view for job locations
- [ ] Saved jobs for job seekers
- [ ] Company profiles
- [ ] Job application tracking
- [ ] RSS feed for jobs
- [ ] Email templates customization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own job board!

## 🌾 About

PlayInDirtJobs connects people with sustainable farming, gardening, and ranching opportunities. We believe in building a future where meaningful agricultural work is accessible to everyone.

---

Built with 💚 for the sustainable agriculture community.
