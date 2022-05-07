import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import { PermissionFilterInput } from '../codegen-generated';

export class PermissionService extends Repository<IAppContext> {
  create(permission: string) {
    return this.db.permission.upsert({
      where: {
        permission,
      },
      update: {
        deletedAt: null,
      },
      create: { permission },
    });
  }

  async update(id: string, permission: string) {
    const permissionInfo = await this.db.permission.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!permissionInfo) {
      throw new ResourceNotFound(`update permission id: ${id} not found`);
    }

    return this.db.permission.update({
      where: {
        id,
      },
      data: {
        permission,
      },
    });
  }

  async delete(id: string) {
    const permissionInfo = await this.db.permission.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!permissionInfo) {
      throw new ResourceNotFound(`delete permission id: ${id} not found`);
    }

    await this.db.permission.update({
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
    const permissionInfo = await this.db.permission.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!permissionInfo) {
      throw new ResourceNotFound(`delete permission id: ${id} not found`);
    }

    return permissionInfo;
  }

  findManyByFilter(filter: PermissionFilterInput) {
    return this.db.permission.findMany({
      ...(filter?.cursor && { skip: 1 }),
      ...(filter?.cursor && {
        cursor: {
          id: filter?.cursor,
        },
      }),
      where: {
        ...(filter?.search && {
          permission: {
            contains: filter?.search,
            mode: 'insensitive',
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
