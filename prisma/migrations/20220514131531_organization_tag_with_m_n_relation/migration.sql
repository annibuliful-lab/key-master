/*
  Warnings:

  - You are about to drop the column `tag` on the `OrganizationTag` table. All the data in the column will be lost.
  - Added the required column `tagId` to the `OrganizationTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OrganizationTag_tag_idx";

-- AlterTable
ALTER TABLE "OrganizationTag" DROP COLUMN "tag",
ADD COLUMN     "tagId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tag_tag_projectId_idx" ON "Tag"("tag", "projectId");

-- CreateIndex
CREATE INDEX "OrganizationTag_tagId_idx" ON "OrganizationTag"("tagId");

-- CreateIndex
CREATE INDEX "OrganizationTag_projectId_idx" ON "OrganizationTag"("projectId");

-- CreateIndex
CREATE INDEX "OrganizationTag_projectOrganizationId_idx" ON "OrganizationTag"("projectOrganizationId");

-- AddForeignKey
ALTER TABLE "OrganizationTag" ADD CONSTRAINT "OrganizationTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
