import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import { Repository } from '@key-master/db';
import { CreateOrganizationKeyManagementUserBookmarkInput } from '../codegen-generated';
import { ForbiddenError } from 'apollo-server-fastify';

export class OrganizationKeyManagementUserBookmarkService extends Repository<IAppContext> {
  async create(data: CreateOrganizationKeyManagementUserBookmarkInput) {
    const organization = await this.db.projectOrganization.findFirst({
      select: {
        id: true,
        organizationUsers: {
          where: {
            userId: this.context.userId,
            deletedAt: null,
          },
          select: {
            userId: true,
          },
        },
      },
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

    const isOrganizationUser = organization.organizationUsers.some(
      (user) => user.userId === this.context.userId
    );

    if (!isOrganizationUser) {
      throw new ForbiddenError('you are not in this organization');
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
