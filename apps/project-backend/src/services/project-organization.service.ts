import { Repository } from '@key-master/db';
import {
  DuplicateResouce,
  IAppContext,
  ResourceNotFound,
} from '@key-master/graphql';
import {
  CreateProjectOrganizationInput,
  ProjectOrganizationFilterInput,
  UpdateProjectOrganizationInput,
} from '../codegen-generated';

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

    if (projectOrganization) {
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

  async update(id: string, input: UpdateProjectOrganizationInput) {
    const projectOrganization = await this.db.projectOrganization.findFirst({
      select: { id: true },
      where: {
        deletedAt: null,
        id,
        projectId: this.context.projectId,
      },
    });

    if (!projectOrganization) {
      throw new ResourceNotFound(`update organization id ${id} not found`);
    }

    if (input.name) {
      const duplicateOrganization = await this.db.projectOrganization.findFirst(
        {
          select: { id: true },
          where: {
            name: input.name,
            projectId: this.context.projectId,
            deletedAt: null,
          },
        }
      );

      if (duplicateOrganization !== null && duplicateOrganization.id !== id) {
        throw new DuplicateResouce(
          `update organization duplicate name ${input.name}`
        );
      }
    }

    return this.db.projectOrganization.update({
      where: {
        id,
      },
      data: { ...input, updatedBy: this.context.userId },
    });
  }

  async delete(id: string) {
    const projectOrganization = await this.db.projectOrganization.findFirst({
      select: { id: true },
      where: {
        deletedAt: null,
        id,
        projectId: this.context.projectId,
      },
    });

    if (!projectOrganization) {
      throw new ResourceNotFound(`delete organization id ${id} not found`);
    }

    await this.db.projectOrganization.update({
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
    const projectOrganization = await this.db.projectOrganization.findFirst({
      where: {
        deletedAt: null,
        id,
        projectId: this.context.projectId,
      },
    });

    if (!projectOrganization) {
      throw new ResourceNotFound(`${id} not found`);
    }

    return projectOrganization;
  }

  findManyByFilter(filter: ProjectOrganizationFilterInput) {
    return this.db.projectOrganization.findMany({
      ...(filter?.cursor && { skip: 1 }),
      ...(filter?.cursor && {
        cursor: {
          id: filter?.cursor,
        },
      }),
      where: {
        ...(filter?.search && {
          permission: {
            contains: filter?.search,
            mode: 'insensitive',
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
