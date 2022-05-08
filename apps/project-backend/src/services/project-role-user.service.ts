import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import {
  CreateProjectRoleUserInput,
  ProjectRoleUserFilterInput,
  UpdateProjectRoleUserInput,
} from '../codegen-generated';

export class ProjectRoleUserService extends Repository<IAppContext> {
  async create(input: CreateProjectRoleUserInput) {
    const user = await this.db.user.findFirst({
      select: { id: true },
      where: {
        id: input.userId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new ResourceNotFound(`create role user ${input.userId} not found`);
    }

    const role = await this.db.projectRole.findFirst({
      select: { id: true },
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

  async update(id: string, input: UpdateProjectRoleUserInput) {
    const projectRoleUser = await this.db.projectRoleUser.findFirst({
      select: { id: true },
      where: {
        id,
        deletedAt: null,
        projectId: this.context.projectId,
      },
    });

    if (!projectRoleUser) {
      throw new ResourceNotFound(`update project role user id ${id} not found`);
    }

    return this.db.projectRoleUser.update({
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
    const projectRoleUser = await this.db.projectRoleUser.findFirst({
      select: { id: true },
      where: {
        id,
        deletedAt: null,
        projectId: this.context.projectId,
      },
    });

    if (!projectRoleUser) {
      throw new ResourceNotFound(`delete project role user id ${id} not found`);
    }
    await this.db.projectRoleUser.update({
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
    const projectRoleUser = await this.db.projectRoleUser.findFirst({
      where: {
        id,
        deletedAt: null,
        projectId: this.context.projectId,
      },
    });

    if (!projectRoleUser) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    return projectRoleUser;
  }
  findManyByFilter(filter: ProjectRoleUserFilterInput) {
    return this.db.projectRoleUser.findMany({
      ...(filter?.cursor && { skip: 1 }),
      ...(filter?.cursor && {
        cursor: {
          id: filter?.cursor,
        },
      }),
      where: {
        ...(filter?.search && {
          user: {
            fullname: {
              contains: filter.search,
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
