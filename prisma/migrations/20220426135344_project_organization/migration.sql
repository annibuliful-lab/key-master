/*
  Warnings:

  - A unique constraint covering the columns `[projectId,name]` on the table `KeyManagment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `KeyManagment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AuditLog_projectId_serviceName_idx";

-- DropIndex
DROP INDEX "KeyManagment_projectId_idx";

-- AlterTable
ALTER TABLE "KeyManagment" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProjectRoleUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectRoleUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectOrganization" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "OrganizationUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationKeyManagement" (
    "id" TEXT NOT NULL,
    "projectOrganizationId" TEXT NOT NULL,
    "keyManagementId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "OrganizationKeyManagement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRoleUser_roleId_userId_key" ON "ProjectRoleUser"("roleId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectOrganization_projectId_name_key" ON "ProjectOrganization"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationKeyManagement_projectOrganizationId_keyManageme_key" ON "OrganizationKeyManagement"("projectOrganizationId", "keyManagementId");

-- CreateIndex
CREATE INDEX "AuditLog_projectId_idx" ON "AuditLog"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "KeyManagment_projectId_name_key" ON "KeyManagment"("projectId", "name");

-- AddForeignKey
ALTER TABLE "ProjectRoleUser" ADD CONSTRAINT "ProjectRoleUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRoleUser" ADD CONSTRAINT "ProjectRoleUser_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRoleUser" ADD CONSTRAINT "ProjectRoleUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectOrganization" ADD CONSTRAINT "ProjectOrganization_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationKeyManagement" ADD CONSTRAINT "OrganizationKeyManagement_projectOrganizationId_fkey" FOREIGN KEY ("projectOrganizationId") REFERENCES "ProjectOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationKeyManagement" ADD CONSTRAINT "OrganizationKeyManagement_keyManagementId_fkey" FOREIGN KEY ("keyManagementId") REFERENCES "KeyManagment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
