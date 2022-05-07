import { Repository } from '@key-master/db';
import {
  DuplicateResouce,
  IAppContext,
  ResourceNotFound,
} from '@key-master/graphql';
import { CreateProjectOrganizationInput } from '../codegen-generated';

export class ProjectOrganizationService extends Repository<IAppContext> {
  async create(input: CreateProjectOrganizationInput) {
    const project = await this.db.project.findFirst({
      select: { id: true },
      where: {
        id: this.context.projectId,
        deletedAt: null,
      },
    });

    if (!project) {
      throw new ResourceNotFound(
        `create organization project id ${this.context.projectId} not found`
      );
    }

    const projectOrganization = await this.db.projectOrganization.findFirst({
      where: {
        deletedAt: null,
        name: input.name,
      },
    });

    if (!projectOrganization) {
      throw new DuplicateResouce(
        `create organization duplicated name ${input.name}`
      );
    }

    return this.db.projectOrganization.create({
      data: {
        ...input,
        projectId: this.context.projectId,
        createdBy: this.context.userId,
        updatedBy: this.context.userId,
      },
    });
  }
}
