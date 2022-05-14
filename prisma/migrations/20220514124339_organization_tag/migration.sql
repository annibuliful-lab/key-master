-- CreateTable
CREATE TABLE "OrganizationTag" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "projectOrganizationId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "OrganizationTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationTag_tag_idx" ON "OrganizationTag"("tag");

-- AddForeignKey
ALTER TABLE "OrganizationTag" ADD CONSTRAINT "OrganizationTag_projectOrganizationId_fkey" FOREIGN KEY ("projectOrganizationId") REFERENCES "ProjectOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
