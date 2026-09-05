-- CreateTable
CREATE TABLE "Workshop" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "instructor" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "outcomes" TEXT[],
    "audience" TEXT NOT NULL,
    "prerequisites" TEXT NOT NULL DEFAULT '',
    "topic" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "venue" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "timeZone" TEXT NOT NULL DEFAULT 'America/New_York',
    "scheduleNotes" TEXT NOT NULL DEFAULT '',
    "registrationClosesAt" TIMESTAMP(3),
    "tuitionCents" INTEGER NOT NULL,
    "priceNotes" TEXT NOT NULL DEFAULT '',
    "registrationUrl" TEXT NOT NULL,
    "organizerWebsite" TEXT NOT NULL DEFAULT '',
    "managementEmail" TEXT,
    "editToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "origin" TEXT NOT NULL DEFAULT 'PAID',
    "sourceUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "promotionEndsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkshopOrder" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "amount" INTEGER NOT NULL DEFAULT 1500,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "snapshot" JSONB NOT NULL,
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkshopOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkshopEvent" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkshopEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workshop_slug_key" ON "Workshop"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Workshop_editToken_key" ON "Workshop"("editToken");

-- CreateIndex
CREATE INDEX "Workshop_status_expiresAt_idx" ON "Workshop"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "Workshop_topic_format_state_idx" ON "Workshop"("topic", "format", "state");

-- CreateIndex
CREATE UNIQUE INDEX "WorkshopOrder_workshopId_key" ON "WorkshopOrder"("workshopId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkshopOrder_stripeCheckoutSessionId_key" ON "WorkshopOrder"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkshopOrder_stripePaymentIntentId_key" ON "WorkshopOrder"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "WorkshopOrder_status_createdAt_idx" ON "WorkshopOrder"("status", "createdAt");

-- CreateIndex
CREATE INDEX "WorkshopEvent_workshopId_eventName_createdAt_idx" ON "WorkshopEvent"("workshopId", "eventName", "createdAt");

-- CreateIndex
CREATE INDEX "WorkshopEvent_createdAt_idx" ON "WorkshopEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "WorkshopOrder" ADD CONSTRAINT "WorkshopOrder_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkshopEvent" ADD CONSTRAINT "WorkshopEvent_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

