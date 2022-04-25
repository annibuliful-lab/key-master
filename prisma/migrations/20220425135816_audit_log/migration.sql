-- CreateEnum
CREATE TYPE "AuditType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "AuditLogStatus" AS ENUM ('ERROR', 'WARN', 'SUCCESS', 'INFO');

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "type" "AuditType" NOT NULL,
    "status" "AuditLogStatus" NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_projectId_serviceName_idx" ON "AuditLog"("projectId", "serviceName");

-- CreateIndex
CREATE INDEX "AuditLog_serviceName_type_idx" ON "AuditLog"("serviceName", "type");

-- CreateIndex
CREATE INDEX "KeyManagment_projectId_idx" ON "KeyManagment"("projectId");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
