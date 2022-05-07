import { Repository } from '@key-master/db';
import {
  DuplicateResouce,
  IAppContext,
  ResourceNotFound,
} from '@key-master/graphql';
import { CreateProjectInput } from '../codegen-generated';

export class ProjectService extends Repository<IAppContext> {
  async create(input: CreateProjectInput) {
    const duplicatedProjectName = this.db.project.findFirst({
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
