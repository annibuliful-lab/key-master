/*
  Warnings:

  - Added the required column `createdBy` to the `ProjectRoleUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `ProjectRoleUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectRoleUser" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;
