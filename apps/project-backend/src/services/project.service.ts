import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import { CreateProjectInput } from '../codegen-generated';

export class ProjectService extends Repository<IAppContext> {
  create(input: CreateProjectInput) {
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
