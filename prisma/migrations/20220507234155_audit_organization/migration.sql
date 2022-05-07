/*
  Warnings:

  - Added the required column `createdBy` to the `OrganizationUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `OrganizationUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `ProjectOrganization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `ProjectOrganization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrganizationUser" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProjectOrganization" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;
