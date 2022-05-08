import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import { ForbiddenError } from 'apollo-server-errors';
import { verify } from 'argon2';
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
        select: { id: true },
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

  async delete(id: string, pin: string) {
    const organizationKeyManagement =
      await this.db.organizationKeyManagement.findFirst({
        select: { id: true },
        where: {
          id,
          deletedAt: null,
        },
      });

    if (!organizationKeyManagement) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    const keyManagement = await this.db.keyManagment.findUnique({
      select: { masterKey: true, pin: true },
      where: {
        id,
      },
    });

    if (!keyManagement) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    const isCorrectPin = await verify(keyManagement.pin, pin);

    if (!isCorrectPin) {
      throw new ForbiddenError('Pin mismatch');
    }

    await this.db.organizationKeyManagement.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        updatedBy: this.context.userId,
      },
    });

    return { success: true };
  }

  async findById(id: string) {
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

    return organizationKeyManagement;
  }
}
