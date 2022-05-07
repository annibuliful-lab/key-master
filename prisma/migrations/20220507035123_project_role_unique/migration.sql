/*
  Warnings:

  - A unique constraint covering the columns `[roleId,userId,projectId]` on the table `ProjectRoleUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProjectRoleUser_roleId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRoleUser_roleId_userId_projectId_key" ON "ProjectRoleUser"("roleId", "userId", "projectId");
