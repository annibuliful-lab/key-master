import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import {
  insertAt,
  orderByActiveStatusOrSortOrderPosition,
} from '@key-master/utils';
import { ForbiddenError } from 'apollo-server-errors';
import { verify } from 'argon2';
import {
  CreateOrganizationKeyManagementInput,
  OrganizationKeyManagementFilterInput,
  UpdateOrganizationKeyManagementInput,
} from '../codegen-generated';

export class OrganizationKeyManagementService extends Repository<IAppContext> {
  async create({
    keyManagementId,
    projectOrganizationId,
    active,
  }: CreateOrganizationKeyManagementInput) {
    const keyManagement = await this.db.keyManagment.findFirst({
      select: { id: true },
      where: {
        id: keyManagementId,
        projectId: this.context.projectId,
        deletedAt: null,
      },
    });

    if (!keyManagement) {
      throw new ResourceNotFound(`key id ${keyManagementId} not found`);
    }

    const projectOrganization = await this.db.projectOrganization.findFirst({
      select: {
        id: true,
      },
      where: {
        id: projectOrganizationId,
        deletedAt: null,
        projectId: this.context.projectId,
      },
    });

    if (!projectOrganization) {
      throw new ResourceNotFound(
        `organization id ${keyManagementId} not found`
      );
    }

    return this.db.$transaction(async (prisma) => {
      await prisma.sortOrderItem.update({
        where: {
          id: projectOrganizationId,
        },
        data: {
          keysIds: {
            push: keyManagementId,
          },
        },
      });

      return prisma.organizationKeyManagement.upsert({
        where: {
          projectOrganizationId_keyManagementId: {
            projectOrganizationId,
            keyManagementId,
          },
        },
        update: {
          deletedAt: null,
        },
        create: {
          keyManagementId,
          projectOrganizationId,
          active,
          createdBy: this.context.userId,
          updatedBy: this.context.userId,
        },
      });
    });
  }

  async update(
    id: string,
    { active, sortOrder }: UpdateOrganizationKeyManagementInput
  ) {
    const organizationKeyManagement =
      await this.db.organizationKeyManagement.findFirst({
        select: { id: true, projectOrganizationId: true },
        where: {
          id,
          deletedAt: null,
        },
      });

    if (!organizationKeyManagement) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    const projectOrganizationId =
      organizationKeyManagement.projectOrganizationId;

    return this.db.$transaction(async (prisma) => {
      if (sortOrder) {
        const sortOrderItem = await prisma.sortOrderItem.findUnique({
          select: { keysIds: true },
          where: {
            id: projectOrganizationId,
          },
        });

        const newSortOrderItem = insertAt({
          array: sortOrderItem.keysIds,
          index: sortOrder,
          newItem: id,
        });

        await prisma.sortOrderItem.update({
          where: {
            id: projectOrganizationId,
          },
          data: {
            keysIds: newSortOrderItem,
            updatedBy: this.context.userId,
          },
        });
      }

      return prisma.organizationKeyManagement.update({
        where: {
          id,
        },
        data: {
          active,
          updatedBy: this.context.userId,
        },
      });
    });
  }

  async delete(id: string, pin: string) {
    const organizationKeyManagement =
      await this.db.organizationKeyManagement.findFirst({
        select: { id: true, projectOrganizationId: true },
        where: {
          id,
          deletedAt: null,
        },
      });

    if (!organizationKeyManagement) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    const keyManagement = await this.db.keyManagment.findUnique({
      select: { masterKey: true, pin: true },
      where: {
        id,
      },
    });

    if (!keyManagement) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    const isCorrectPin = await verify(keyManagement.pin, pin);

    if (!isCorrectPin) {
      throw new ForbiddenError('Pin mismatch');
    }

    await this.db.$transaction(async (prisma) => {
      const sortOrderItem = await prisma.sortOrderItem.findUnique({
        select: { keysIds: true },
        where: {
          id: organizationKeyManagement.projectOrganizationId,
        },
      });

      const newSortOrderItem = (sortOrderItem.keysIds ?? []).filter(
        (item) => item !== id
      );
      await prisma.sortOrderItem.update({
        where: {
          id: organizationKeyManagement.projectOrganizationId,
        },
        data: {
          keysIds: newSortOrderItem,
          updatedBy: this.context.userId,
        },
      });

      await prisma.organizationKeyManagement.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
          updatedBy: this.context.userId,
        },
      });
    });

    return { success: true };
  }

  async findById(id: string) {
    const organizationKeyManagement =
      await this.db.organizationKeyManagement.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

    if (!organizationKeyManagement) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    return organizationKeyManagement;
  }

  async findManyByFilter(filter: OrganizationKeyManagementFilterInput) {
    const sortOrderItems = await this.db.sortOrderItem.findUnique({
      select: {
        keysIds: true,
      },
      where: {
        id: filter.organizationId,
      },
    });

    const sortOrderIds = sortOrderItems?.keysIds ?? [];

    const organizationKeyManagements =
      await this.db.organizationKeyManagement.findMany({
        ...(filter?.cursor && { skip: 1 }),
        ...(filter?.cursor && {
          cursor: {
            id: filter?.cursor,
          },
        }),
        where: {
          projectOrganizationId: filter.organizationId,
          ...(filter?.search && {
            keyManagement: {
              name: {
                contains: filter.search,
                mode: 'insensitive',
              },
              deletedAt: null,
            },
          }),
          deletedAt: null,
        },
        orderBy: {
          id: 'asc',
        },
        take: filter?.take ?? 20,
      });

    return orderByActiveStatusOrSortOrderPosition(
      organizationKeyManagements,
      sortOrderIds
    );
  }
}
