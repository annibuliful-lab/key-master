import { Repository } from '@key-master/db';
import {
  DuplicateResource,
  IAppContext,
  ResourceNotFound,
} from '@key-master/graphql';
import {
  CreateProjectRoleInput,
  UpdateProjectRoleInput,
} from '../codegen-generated';

export class ProjectRoleService extends Repository<IAppContext> {
  async create(data: CreateProjectRoleInput) {
    const projectRole = await this.db.projectRole.findFirst({
      select: { id: true },
      where: {
        role: data.role,
        deletedAt: null,
      },
    });

    if (projectRole) {
      throw new DuplicateResource(`create duplicate project role ${data.role}`);
    }

    return this.db.projectRole.create({
      data: {
        ...data,
        projectId: this.context.projectId,
      },
    });
  }

  async update(id: string, data: UpdateProjectRoleInput) {
    const projectRole = await this.db.projectRole.findFirst({
      select: { id: true },
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!projectRole) {
      throw new ResourceNotFound(`update project role id ${id} not found`);
    }

    return this.db.projectRole.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    const projectRole = await this.db.projectRole.findFirst({
      select: { id: true },
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!projectRole) {
      throw new ResourceNotFound(`delete project role id ${id} not found`);
    }

    await this.db.projectRole.update({
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
    const role = await this.db.projectRole.findFirst({
      where: {
        id,
        projectId: this.context.projectId,
        deletedAt: null,
      },
    });

    if (!role) {
      throw new ResourceNotFound(`id ${id} not found `);
    }

    return role;
  }

  async findByProject() {
    const project = await this.db.project.findFirst({
      select: {
        id: true,
      },
      where: {
        id: this.context.projectId,
        deletedAt: null,
      },
    });

    if (!project) {
      throw new ResourceNotFound(`project id ${this.context.projectId}`);
    }

    return this.db.projectRole.findMany({
      where: {
        projectId: this.context.projectId,
        deletedAt: null,
      },
    });
  }
}
