import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import { Repository } from '@key-master/db';
import { CreateOrganizationKeyManagementUserBookmarkInput } from '../codegen-generated';

export class OrganizationKeyManagementUserBookmarkService extends Repository<IAppContext> {
  create(data: CreateOrganizationKeyManagementUserBookmarkInput) {
    const organization = this.db.projectOrganization.findFirst({
      where: {
        id: this.context.orgId,
        deletedAt: null,
      },
    });

    if (!organization) {
      throw new ResourceNotFound(
        `create user key bookmark: id ${this.context.orgId} not found`
      );
    }

    return this.db.organizationKeyManagementUserBookmark.upsert({
      where: {
        projectOrganizationId_keyManagementId_userId: {
          userId: this.context.userId,
          projectOrganizationId: this.context.orgId,
          keyManagementId: data.keyManagementId,
        },
      },
      update: {
        deletedAt: null,
      },
      create: {
        userId: this.context.userId,
        projectOrganizationId: this.context.orgId,
        keyManagementId: data.keyManagementId,
        createdBy: this.context.userId,
        updatedBy: this.context.userId,
      },
    });
  }
}
