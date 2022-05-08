import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import {
  CreateOrganizationKeyManagementInput,
  UpdateOrganizationKeyManagementInput,
} from '../codegen-generated';

export class OrganizationKeyManagementService extends Repository<IAppContext> {
  async create({
    keyManagementId,
    projectOrganizationId,
    active,
  }: CreateOrganizationKeyManagementInput) {
    const keyManagement = await this.db.keyManagment.findFirst({
      select: { id: true },
      where: {
        id: keyManagementId,
        projectId: this.context.projectId,
        deletedAt: null,
      },
    });

    if (!keyManagement) {
      throw new ResourceNotFound(`key id ${keyManagementId} not found`);
    }

    const projectOrganization = await this.db.projectOrganization.findFirst({
      select: {
        id: true,
      },
      where: {
        id: projectOrganizationId,
        deletedAt: null,
        projectId: this.context.projectId,
      },
    });

    if (!projectOrganization) {
      throw new ResourceNotFound(
        `organization id ${keyManagementId} not found`
      );
    }

    return this.db.organizationKeyManagement.upsert({
      where: {
        projectOrganizationId_keyManagementId: {
          projectOrganizationId,
          keyManagementId,
        },
      },
      update: {
        deletedAt: null,
      },
      create: {
        keyManagementId,
        projectOrganizationId,
        active,
        createdBy: this.context.userId,
        updatedBy: this.context.userId,
      },
    });
  }

  async update(id: string, { active }: UpdateOrganizationKeyManagementInput) {
    const organizationKeyManagement =
      await this.db.organizationKeyManagement.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

    if (!organizationKeyManagement) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    return this.db.organizationKeyManagement.update({
      where: {
        id,
      },
      data: {
        active,
        updatedBy: this.context.userId,
      },
    });
  }
}
