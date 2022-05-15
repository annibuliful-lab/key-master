import { Repository } from '@key-master/db';
import {
  DuplicateResource,
  IAppContext,
  ResourceNotFound,
} from '@key-master/graphql';
import {
  CreateProjectTagInput,
  UpdateProjectTagInput,
} from '../codegen-generated';

export class ProjectTagService extends Repository<IAppContext> {
  async create(data: CreateProjectTagInput) {
    const projectTag = await this.db.projectTag.findFirst({
      select: { id: true },
      where: {
        projectId: this.context.projectId,
        tag: data.tag,
        deletedAt: null,
      },
    });

    if (projectTag) {
      throw new DuplicateResource(
        `create project tag: duplicated tag ${data.tag}`
      );
    }

    return this.db.projectTag.create({
      data: {
        ...data,
        projectId: this.context.projectId,
        createdBy: this.context.userId,
        updatedBy: this.context.userId,
      },
    });
  }

  async update(id: string, input: UpdateProjectTagInput) {
    const projectTag = await this.db.projectTag.findFirst({
      select: {
        id: true,
      },
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!projectTag) {
      throw new ResourceNotFound(`update project tag: ${id} not found`);
    }

    return this.db.projectTag.update({
      where: {
        id,
      },
      data: {
        tag: input.tag,
        updatedBy: this.context.userId,
      },
    });
  }
}
