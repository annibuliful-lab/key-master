import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';

import {
  CreateOrganizationUserInput,
  OrganizationUserFilterInput,
  UpdateOrganizationUserInput,
} from '../codegen-generated';

export class OrganizationUserService extends Repository<IAppContext> {
  async create(input: CreateOrganizationUserInput) {
    const organization = await this.db.projectOrganization.findFirst({
      select: { id: true },
      where: {
        deletedAt: null,
        id: input.organizationId,
        projectId: this.context.projectId,
      },
    });

    if (!organization) {
      throw new ResourceNotFound(
        `organization id ${input.organizationId} not found`
      );
    }

    const projectRoleUser = await this.db.projectRoleUser.findFirst({
      select: { id: true },
      where: {
        deletedAt: null,
        projectId: this.context.projectId,
        userId: input.userId,
        active: true,
      },
    });

    if (!projectRoleUser) {
      throw new ResourceNotFound(`user id ${input.userId} not found`);
    }

    return this.db.organizationUser.create({
      data: {
        ...input,
        createdBy: this.context.userId,
        updatedBy: this.context.userId,
      },
    });
  }

  async update(id: string, input: UpdateOrganizationUserInput) {
    const organizationUser = await this.db.organizationUser.findFirst({
      select: { id: true },
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!organizationUser) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    return this.db.organizationUser.update({
      where: {
        id,
      },
      data: {
        ...input,
        updatedBy: this.context.userId,
      },
    });
  }

  async delete(id: string) {
    const organizationUser = await this.db.organizationUser.findFirst({
      select: { id: true },
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!organizationUser) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    await this.db.organizationUser.delete({
      where: { id },
    });

    return { success: true };
  }

  async findById(id: string) {
    const organizationUser = await this.db.organizationUser.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!organizationUser) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    return organizationUser;
  }

  findManyByFilter(filter: OrganizationUserFilterInput) {
    return this.db.organizationUser.findMany({
      ...(filter?.cursor && { skip: 1 }),
      ...(filter?.cursor && {
        cursor: {
          id: filter?.cursor,
        },
      }),
      where: {
        organizationId: filter.organizationId,
        ...(filter?.search && {
          user: {
            fullname: {
              contains: filter?.search,
              mode: 'insensitive',
            },
          },
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
