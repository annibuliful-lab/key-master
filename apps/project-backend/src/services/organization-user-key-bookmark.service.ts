import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import { Repository } from '@key-master/db';
import {
  CreateOrganizationKeyManagementUserBookmarkInput,
  OrganizationKeyManagementUserBookmarkFilterInput,
} from '../codegen-generated';
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

  async delete(id: string) {
    const bookmark =
      await this.db.organizationKeyManagementUserBookmark.findFirst({
        select: { userId: true },
        where: {
          id,
          deletedAt: null,
        },
      });

    if (!bookmark) {
      throw new ResourceNotFound(`delete user key bookmark: ${id} not found`);
    }

    if (bookmark.userId !== this.context.userId) {
      throw new ForbiddenError('you are not owner');
    }

    await this.db.organizationKeyManagementUserBookmark.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return { success: true };
  }

  async findById(id: string) {
    const bookmark =
      await this.db.organizationKeyManagementUserBookmark.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

    if (!bookmark) {
      throw new ResourceNotFound(`${id} not found`);
    }

    if (bookmark.userId !== this.context.userId) {
      throw new ForbiddenError('you are not owner');
    }

    return bookmark;
  }

  findManyByFilter(filter: OrganizationKeyManagementUserBookmarkFilterInput) {
    return this.db.organizationKeyManagementUserBookmark.findMany({
      ...(filter?.cursor && { skip: 1 }),
      ...(filter?.cursor && {
        cursor: {
          id: filter?.cursor,
        },
      }),
      where: {
        ...(filter?.search && {
          OR: [
            {
              projectOrganization: {
                name: {
                  contains: filter?.search,
                  mode: 'insensitive',
                },
              },
            },
            {
              keyManagement: {
                name: {
                  contains: filter?.search,
                  mode: 'insensitive',
                },
              },
            },
          ],
        }),
        deletedAt: null,
      },
      orderBy: {
        id: 'asc',
      },
      take: filter?.take ?? 20,
    });
  }
}
