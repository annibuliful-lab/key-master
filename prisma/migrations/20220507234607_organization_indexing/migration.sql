-- DropIndex
DROP INDEX "ProjectOrganization_projectId_name_key";

-- CreateIndex
CREATE INDEX "ProjectOrganization_projectId_name_idx" ON "ProjectOrganization"("projectId", "name");
