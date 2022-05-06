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

  async getById(id: string) {
    const project = await this.db.project.findFirst({
      where: {
        id,
        ownerId: this.context.userId,
      },
    });

    if (!project) {
      throw new ResourceNotFound(`get project by id ${id} not found`);
    }

    return project;
  }
}
