import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import { CreateProjectRoleUserInput } from '../codegen-generated';

export class ProjectRoleUserService extends Repository<IAppContext> {
  async create(input: CreateProjectRoleUserInput) {
    const user = await this.db.user.findFirst({
      where: {
        id: input.userId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new ResourceNotFound(`create role user ${input.userId} not found`);
    }

    const role = await this.db.projectRole.findFirst({
      where: {
        deletedAt: null,
        projectId: this.context.projectId,
        id: input.roleId,
      },
    });

    if (!role) {
      throw new ResourceNotFound(
        `create project role id ${input.roleId} not found`
      );
    }

    const projectRoleUser = await this.db.projectRoleUser.findFirst({
      select: {
        id: true,
        roleId: true,
      },
      where: {
        deletedAt: null,
        userId: input.userId,
        projectId: this.context.projectId,
      },
    });

    return this.db.$transaction(async (prisma) => {
      if (projectRoleUser && projectRoleUser.roleId !== input.roleId) {
        await prisma.projectRole.update({
          where: {
            id: projectRoleUser.id,
          },
          data: {
            deletedAt: null,
          },
        });
      }

      return prisma.projectRoleUser.upsert({
        where: {
          roleId_userId_projectId: {
            projectId: this.context.projectId,
            userId: input.userId,
            roleId: input.roleId,
          },
        },
        update: {
          deletedAt: null,
        },
        create: {
          ...input,
          projectId: this.context.projectId,
          createdBy: this.context.userId,
          updatedBy: this.context.userId,
        },
      });
    });
  }
}
