-- CreateTable
CREATE TABLE "OrganizationKeyManagementUserBookmark" (
    "id" TEXT NOT NULL,
    "projectOrganizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "keyManagementId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "OrganizationKeyManagementUserBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationKeyManagementUserBookmark_projectOrganizationId_key" ON "OrganizationKeyManagementUserBookmark"("projectOrganizationId", "keyManagementId", "userId");

-- AddForeignKey
ALTER TABLE "OrganizationKeyManagementUserBookmark" ADD CONSTRAINT "OrganizationKeyManagementUserBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationKeyManagementUserBookmark" ADD CONSTRAINT "OrganizationKeyManagementUserBookmark_projectOrganizationI_fkey" FOREIGN KEY ("projectOrganizationId") REFERENCES "ProjectOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationKeyManagementUserBookmark" ADD CONSTRAINT "OrganizationKeyManagementUserBookmark_keyManagementId_fkey" FOREIGN KEY ("keyManagementId") REFERENCES "KeyManagment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
