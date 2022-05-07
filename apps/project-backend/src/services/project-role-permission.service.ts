import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';
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

      await prisma.projectRolePermission.createMany({
        skipDuplicates: true,
        data: input.permissionIds.map((permissionId) => ({
          permissionId,
          roleId: input.roleId,
          createdBy: this.context.userId,
          updatedBy: this.context.userId,
        })),
      });
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
