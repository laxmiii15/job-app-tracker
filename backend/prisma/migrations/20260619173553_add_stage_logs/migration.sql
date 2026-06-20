-- CreateTable
CREATE TABLE "stage_logs" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "from_status" "ApplicationStatus",
    "to_status" "ApplicationStatus" NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stage_logs_application_id_idx" ON "stage_logs"("application_id");

-- AddForeignKey
ALTER TABLE "stage_logs" ADD CONSTRAINT "stage_logs_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
