/*
  Warnings:

  - A unique constraint covering the columns `[projectId,role]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Role_projectId_role_key" ON "Role"("projectId", "role");
