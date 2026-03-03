-- CreateIndex
CREATE INDEX IF NOT EXISTS "Job_active_expiresAt_createdAt_idx" ON "Job"("active", "expiresAt", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Job_companyEmail_idx" ON "Job"("companyEmail");
