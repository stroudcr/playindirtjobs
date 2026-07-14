-- CreateEnum
CREATE TYPE "EmployerRole" AS ENUM ('EMPLOYER', 'ADMIN');
CREATE TYPE "AuthTokenPurpose" AS ENUM ('SIGN_IN');
CREATE TYPE "JobOrigin" AS ENUM ('EMPLOYER', 'IMPORTED');
CREATE TYPE "JobDraftStatus" AS ENUM ('DRAFT', 'CHECKOUT', 'CONVERTED', 'ABANDONED');
CREATE TYPE "PurchaseKind" AS ENUM ('POSTING', 'RENEWAL');
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELED');
CREATE TYPE "ListingClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DISPUTED');
CREATE TYPE "EmployerLeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST', 'UNSUBSCRIBED');
CREATE TYPE "OutreachMessageStatus" AS ENUM ('DRAFT', 'APPROVED', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED', 'CANCELED');
CREATE TYPE "EmailOutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "Job"
ADD COLUMN "closeReason" TEXT,
ADD COLUMN "closedAt" TIMESTAMP(3),
ADD COLUMN "employerId" TEXT,
ADD COLUMN "hireSource" TEXT,
ADD COLUMN "managementEmail" TEXT,
ADD COLUMN "origin" "JobOrigin" NOT NULL DEFAULT 'EMPLOYER',
ADD COLUMN "publishedAt" TIMESTAMP(3);

-- Preserve the private management address while legacy companyEmail remains for compatibility.
UPDATE "Job"
SET "managementEmail" = "companyEmail"
WHERE "managementEmail" IS NULL;

-- Existing listings predate the explicit publication timestamp; createdAt is the
-- best available historical publication marker for reporting and renewals.
UPDATE "Job"
SET "publishedAt" = "createdAt"
WHERE "publishedAt" IS NULL;

-- Existing syndicated listings use this known placeholder management address.
UPDATE "Job"
SET "origin" = 'IMPORTED'
WHERE lower(trim("companyEmail")) = 'playindirtjobs@welldiem.com';

-- CreateTable
CREATE TABLE "Employer" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "EmployerRole" NOT NULL DEFAULT 'EMPLOYER',
    "name" TEXT,
    "company" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "purpose" "AuthTokenPurpose" NOT NULL DEFAULT 'SIGN_IN',
    "returnTo" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "previousTokenHash" TEXT,
    "previousTokenExpiresAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rotatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "JobDraft" (
    "id" TEXT NOT NULL,
    "employerId" TEXT,
    "sourceJobId" TEXT,
    "accessTokenHash" TEXT NOT NULL,
    "email" TEXT,
    "status" "JobDraftStatus" NOT NULL DEFAULT 'DRAFT',
    "data" JSONB NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'basic',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "importUrl" TEXT,
    "attribution" JSONB,
    "recoveryOptIn" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "JobDraft_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "draftId" TEXT,
    "employerId" TEXT,
    "jobId" TEXT,
    "kind" "PurchaseKind" NOT NULL DEFAULT 'POSTING',
    "plan" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StripeEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "processedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StripeEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FunnelEvent" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "jobId" TEXT,
    "employerId" TEXT,
    "draftId" TEXT,
    "purchaseId" TEXT,
    "anonymousId" TEXT,
    "source" TEXT,
    "landingPath" TEXT,
    "referrerHost" TEXT,
    "properties" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FunnelEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ListingClaim" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "workEmail" TEXT NOT NULL,
    "status" "ListingClaimStatus" NOT NULL DEFAULT 'PENDING',
    "evidence" JSONB,
    "notes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ListingClaim_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmployerLead" (
    "id" TEXT NOT NULL,
    "employerId" TEXT,
    "email" TEXT,
    "name" TEXT,
    "company" TEXT,
    "source" TEXT,
    "sourceUrl" TEXT,
    "status" "EmployerLeadStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "metadata" JSONB,
    "nextActionAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EmployerLead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutreachMessage" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "employerId" TEXT,
    "recipient" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "payload" JSONB,
    "status" "OutreachMessageStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "providerMessageId" TEXT,
    "sentAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OutreachMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmailOutbox" (
    "id" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "EmailOutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "lastError" TEXT,
    "deduplicationKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EmailOutbox_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SuppressionEntry" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SuppressionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employer_email_key" ON "Employer"("email");
CREATE INDEX "Employer_role_idx" ON "Employer"("role");
CREATE INDEX "Employer_createdAt_idx" ON "Employer"("createdAt");
CREATE UNIQUE INDEX "AuthToken_tokenHash_key" ON "AuthToken"("tokenHash");
CREATE INDEX "AuthToken_employerId_purpose_createdAt_idx" ON "AuthToken"("employerId", "purpose", "createdAt");
CREATE INDEX "AuthToken_expiresAt_idx" ON "AuthToken"("expiresAt");
CREATE UNIQUE INDEX "AuthSession_tokenHash_key" ON "AuthSession"("tokenHash");
CREATE UNIQUE INDEX "AuthSession_previousTokenHash_key" ON "AuthSession"("previousTokenHash");
CREATE INDEX "AuthSession_employerId_expiresAt_idx" ON "AuthSession"("employerId", "expiresAt");
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");
CREATE UNIQUE INDEX "JobDraft_accessTokenHash_key" ON "JobDraft"("accessTokenHash");
CREATE INDEX "JobDraft_employerId_status_updatedAt_idx" ON "JobDraft"("employerId", "status", "updatedAt");
CREATE INDEX "JobDraft_sourceJobId_idx" ON "JobDraft"("sourceJobId");
CREATE INDEX "JobDraft_status_expiresAt_idx" ON "JobDraft"("status", "expiresAt");
CREATE INDEX "JobDraft_email_idx" ON "JobDraft"("email");
CREATE UNIQUE INDEX "Purchase_draftId_key" ON "Purchase"("draftId");
CREATE UNIQUE INDEX "Purchase_stripeCheckoutSessionId_key" ON "Purchase"("stripeCheckoutSessionId");
CREATE UNIQUE INDEX "Purchase_stripePaymentIntentId_key" ON "Purchase"("stripePaymentIntentId");
CREATE INDEX "Purchase_employerId_status_createdAt_idx" ON "Purchase"("employerId", "status", "createdAt");
CREATE INDEX "Purchase_jobId_idx" ON "Purchase"("jobId");
CREATE INDEX "Purchase_status_createdAt_idx" ON "Purchase"("status", "createdAt");
CREATE INDEX "StripeEvent_processedAt_createdAt_idx" ON "StripeEvent"("processedAt", "createdAt");
CREATE INDEX "StripeEvent_type_createdAt_idx" ON "StripeEvent"("type", "createdAt");
CREATE INDEX "FunnelEvent_eventName_jobId_anonymousId_createdAt_idx" ON "FunnelEvent"("eventName", "jobId", "anonymousId", "createdAt");
CREATE INDEX "FunnelEvent_jobId_idx" ON "FunnelEvent"("jobId");
CREATE INDEX "FunnelEvent_employerId_eventName_createdAt_idx" ON "FunnelEvent"("employerId", "eventName", "createdAt");
CREATE INDEX "FunnelEvent_draftId_eventName_createdAt_idx" ON "FunnelEvent"("draftId", "eventName", "createdAt");
CREATE INDEX "FunnelEvent_purchaseId_idx" ON "FunnelEvent"("purchaseId");
CREATE INDEX "FunnelEvent_createdAt_idx" ON "FunnelEvent"("createdAt");
CREATE INDEX "ListingClaim_jobId_status_createdAt_idx" ON "ListingClaim"("jobId", "status", "createdAt");
CREATE INDEX "ListingClaim_employerId_status_idx" ON "ListingClaim"("employerId", "status");
CREATE INDEX "ListingClaim_reviewedById_idx" ON "ListingClaim"("reviewedById");
CREATE INDEX "ListingClaim_workEmail_idx" ON "ListingClaim"("workEmail");
CREATE INDEX "EmployerLead_employerId_idx" ON "EmployerLead"("employerId");
CREATE INDEX "EmployerLead_email_idx" ON "EmployerLead"("email");
CREATE INDEX "EmployerLead_status_nextActionAt_idx" ON "EmployerLead"("status", "nextActionAt");
CREATE INDEX "EmployerLead_source_createdAt_idx" ON "EmployerLead"("source", "createdAt");
CREATE UNIQUE INDEX "OutreachMessage_providerMessageId_key" ON "OutreachMessage"("providerMessageId");
CREATE INDEX "OutreachMessage_leadId_idx" ON "OutreachMessage"("leadId");
CREATE INDEX "OutreachMessage_employerId_idx" ON "OutreachMessage"("employerId");
CREATE INDEX "OutreachMessage_approvedById_idx" ON "OutreachMessage"("approvedById");
CREATE INDEX "OutreachMessage_status_scheduledAt_idx" ON "OutreachMessage"("status", "scheduledAt");
CREATE INDEX "OutreachMessage_recipient_createdAt_idx" ON "OutreachMessage"("recipient", "createdAt");
CREATE UNIQUE INDEX "EmailOutbox_deduplicationKey_key" ON "EmailOutbox"("deduplicationKey");
CREATE INDEX "EmailOutbox_status_nextAttemptAt_idx" ON "EmailOutbox"("status", "nextAttemptAt");
CREATE INDEX "EmailOutbox_recipient_createdAt_idx" ON "EmailOutbox"("recipient", "createdAt");
CREATE UNIQUE INDEX "SuppressionEntry_email_key" ON "SuppressionEntry"("email");
CREATE INDEX "SuppressionEntry_createdAt_idx" ON "SuppressionEntry"("createdAt");
CREATE INDEX "Job_managementEmail_idx" ON "Job"("managementEmail");
CREATE INDEX "Job_employerId_active_idx" ON "Job"("employerId", "active");
CREATE INDEX "Job_origin_active_idx" ON "Job"("origin", "active");

-- AddForeignKey (foreign-key columns are indexed above)
ALTER TABLE "Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JobDraft" ADD CONSTRAINT "JobDraft_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "JobDraft" ADD CONSTRAINT "JobDraft_sourceJobId_fkey" FOREIGN KEY ("sourceJobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "JobDraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FunnelEvent" ADD CONSTRAINT "FunnelEvent_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FunnelEvent" ADD CONSTRAINT "FunnelEvent_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FunnelEvent" ADD CONSTRAINT "FunnelEvent_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "JobDraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FunnelEvent" ADD CONSTRAINT "FunnelEvent_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ListingClaim" ADD CONSTRAINT "ListingClaim_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ListingClaim" ADD CONSTRAINT "ListingClaim_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ListingClaim" ADD CONSTRAINT "ListingClaim_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "EmployerLead" ADD CONSTRAINT "EmployerLead_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OutreachMessage" ADD CONSTRAINT "OutreachMessage_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "EmployerLead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OutreachMessage" ADD CONSTRAINT "OutreachMessage_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OutreachMessage" ADD CONSTRAINT "OutreachMessage_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
