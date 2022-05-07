-- DropIndex
DROP INDEX "ProjectRole_projectId_role_key";

-- CreateIndex
CREATE INDEX "ProjectRole_projectId_role_idx" ON "ProjectRole"("projectId", "role");
