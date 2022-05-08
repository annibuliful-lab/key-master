-- DropIndex
DROP INDEX "KeyManagment_projectId_name_key";

-- CreateIndex
CREATE INDEX "KeyManagment_projectId_name_idx" ON "KeyManagment"("projectId", "name");
