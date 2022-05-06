import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';

export class PermissionService extends Repository<IAppContext> {
  create(permission: string) {
    return this.db.permission.create({
      data: { permission },
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

    return this.db.permission.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
  async getById(id: string) {
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
}
