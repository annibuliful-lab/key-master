/*
  Warnings:

  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_projectId_fkey";

-- DropTable
DROP TABLE "AuditLog";

-- DropEnum
DROP TYPE "AuditLogStatus";

-- DropEnum
DROP TYPE "AuditType";

-- CreateTable
CREATE TABLE "SortOrderItem" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "keysIds" TEXT[],
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SortOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SortOrderItem_parentId_idx" ON "SortOrderItem"("parentId");
