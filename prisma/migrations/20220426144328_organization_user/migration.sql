/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,userId]` on the table `OrganizationUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `OrganizationUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrganizationUser" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUser_organizationId_userId_key" ON "OrganizationUser"("organizationId", "userId");

-- AddForeignKey
ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "ProjectOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
