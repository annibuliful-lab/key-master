/*
  Warnings:

  - A unique constraint covering the columns `[tag,projectId]` on the table `ProjectTag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProjectTag_tag_projectId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTag_tag_projectId_key" ON "ProjectTag"("tag", "projectId");
