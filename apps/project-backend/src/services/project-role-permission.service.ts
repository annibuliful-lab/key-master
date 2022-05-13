import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import { difference } from 'lodash';
import { SetProjectRolePermissionsInput } from '../codegen-generated';

export class ProjectRolePermissionService extends Repository<IAppContext> {
  async setRolePermissions(input: SetProjectRolePermissionsInput) {
    const projectRole = await this.db.projectRole.findFirst({
      select: {
        id: true,
      },
      where: {
        id: input.roleId,
        projectId: this.context.projectId,
      },
    });

    if (!projectRole) {
      throw new ResourceNotFound(
        `set role permission project role id ${input.roleId} not found`
      );
    }

    const permissions = await this.db.permission.findMany({
      select: {
        id: true,
      },
      where: {
        id: {
          in: input.permissionIds,
        },
        deletedAt: null,
      },
    });

    const permissionIds = permissions.map((permission) => permission.id);
    const deletedPermissionIds = difference(input.permissionIds, permissionIds);
    if (deletedPermissionIds.length > 0) {
      throw new ResourceNotFound(
        `set role permission: permission ids ${deletedPermissionIds.join(
          ','
        )} not found`
      );
    }

    const rolePermissions = await this.db.projectRolePermission.findMany({
      select: {
        permissionId: true,
      },
      where: {
        roleId: input.roleId,
      },
    });

    const rolePermissionIds = rolePermissions.map((role) => role.permissionId);

    const deletedIds = rolePermissionIds.filter(
      (id) => !input.permissionIds.includes(id)
    );

    await this.db.$transaction(async (prisma) => {
      if (deletedIds.length > 0) {
        await prisma.projectRolePermission.deleteMany({
          where: {
            id: {
              in: deletedIds,
            },
          },
        });
      }

      const listUpsertPermissions = input.permissionIds.map((permissionId) =>
        prisma.projectRolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: input.roleId,
              permissionId,
            },
          },

          update: {
            deletedAt: null,
          },
          create: {
            permissionId,
            roleId: input.roleId,
            createdBy: this.context.userId,
            updatedBy: this.context.userId,
          },
        })
      );

      await Promise.all(listUpsertPermissions);
    });

    return this.db.projectRolePermission.findMany({
      where: {
        roleId: input.roleId,
        deletedAt: null,
      },
    });
  }

  async findByRoleId(roleId: string) {
    const projectRole = await this.db.projectRole.findFirst({
      select: {
        id: true,
      },
      where: {
        id: roleId,
        projectId: this.context.projectId,
      },
    });

    if (!projectRole) {
      throw new ResourceNotFound(
        `set role permission project role id ${roleId} not found`
      );
    }

    return this.db.projectRolePermission.findMany({
      where: {
        roleId,
        deletedAt: null,
      },
    });
  }
}
