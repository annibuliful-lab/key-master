import { Repository } from '@key-master/db';
import {
  DuplicateResouce,
  IAppContext,
  ResourceNotFound,
} from '@key-master/graphql';
import { CreateProjectInput, UpdateProjectInput } from '../codegen-generated';

export class ProjectService extends Repository<IAppContext> {
  async create(input: CreateProjectInput) {
    const duplicatedProjectName = await this.db.project.findFirst({
      select: {
        id: true,
      },
      where: {
        name: input.name,
        ownerId: this.context.userId,
        deletedAt: null,
      },
    });

    if (duplicatedProjectName) {
      throw new DuplicateResouce(
        `create project: duplicated project name ${input.name}`
      );
    }

    return this.db.project.create({
      data: {
        ...input,
        ownerId: this.context.userId,
      },
    });
  }

  async updateProject(id: string, data: UpdateProjectInput) {
    const project = await this.db.project.findFirst({
      select: { id: true },
      where: {
        ownerId: this.context.userId,
        deletedAt: null,
        id,
      },
    });

    if (!project) {
      throw new ResourceNotFound(`update project id ${id} not found`);
    }

    return this.db.project.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteProject(id: string) {
    const project = await this.db.project.findFirst({
      select: { id: true },
      where: {
        ownerId: this.context.userId,
        deletedAt: null,
        id,
      },
    });

    if (!project) {
      throw new ResourceNotFound(`delete project id ${id} not found`);
    }

    await this.db.project.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
    };
  }

  async findById(id: string) {
    const project = await this.db.project.findFirst({
      where: {
        id,
        OR: [
          {
            ownerId: this.context.userId,
          },
          {
            projectRoleUsers: {
              some: {
                userId: this.context.userId,
              },
            },
          },
        ],
      },
    });

    if (!project) {
      throw new ResourceNotFound(`get project by id ${id} not found`);
    }

    return project;
  }

  async findManyByOwnder() {
    return this.db.project.findMany({
      where: {
        ownerId: this.context.userId,
      },
    });
  }
}
