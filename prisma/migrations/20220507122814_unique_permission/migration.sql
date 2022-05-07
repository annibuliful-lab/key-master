/*
  Warnings:

  - A unique constraint covering the columns `[permission]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_permission_key" ON "Permission"("permission");
