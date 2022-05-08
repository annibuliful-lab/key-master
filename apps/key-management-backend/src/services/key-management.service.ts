import { Repository } from '@key-master/db';
import {
  DuplicateResouce,
  IAppContext,
  ResourceNotFound,
} from '@key-master/graphql';
import { ForbiddenError } from 'apollo-server-core';
import { hash, verify } from 'argon2';
import {
  CreateKeyManagementInput,
  UpdateKeyManagementInput,
  UpdateKeyManagementPinInput,
} from '../codegen-generated';

export class KeyManagementService extends Repository<IAppContext> {
  async create(input: CreateKeyManagementInput) {
    const keyManagement = await this.db.keyManagment.findFirst({
      select: { id: true },
      where: {
        name: input.name,
        projectId: this.context.projectId,
        deletedAt: null,
      },
    });

    if (keyManagement) {
      throw new DuplicateResouce(`duplicated key name ${input.name}`);
    }

    input.pin = await hash(input.pin);

    return this.db.keyManagment.create({
      data: {
        ...input,
        projectId: this.context.projectId,
        createdBy: this.context.userId,
        updatedBy: this.context.userId,
      },
    });
  }

  async update(id: string, input: UpdateKeyManagementInput) {
    const keyManagement = await this.db.keyManagment.findFirst({
      select: { id: true, pin: true },
      where: {
        id,
        projectId: this.context.projectId,
        deletedAt: null,
      },
    });

    if (!keyManagement) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    const isCorrectPin = await verify(keyManagement.pin, input.pin);

    if (!isCorrectPin) {
      throw new ForbiddenError('Pin mismatch');
    }

    return this.db.keyManagment.update({
      where: {
        id,
      },
      data: {
        ...input,
        updatedBy: this.context.userId,
      },
    });
  }

  async updatePin(id: string, input: UpdateKeyManagementPinInput) {
    const keyManagement = await this.db.keyManagment.findFirst({
      select: { id: true, pin: true },
      where: {
        id,
        projectId: this.context.projectId,
        deletedAt: null,
      },
    });

    if (!keyManagement) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    const isCorrectPin = await verify(keyManagement.pin, input.oldPin);

    if (!isCorrectPin) {
      throw new ForbiddenError('Pin mismatch');
    }

    return this.db.keyManagment.update({
      where: {
        id,
      },
      data: {
        pin: await hash(input.newPin),
        updatedBy: this.context.userId,
      },
    });
  }

  async delete(id: string, pin: string) {
    const keyManagement = await this.db.keyManagment.findFirst({
      select: { id: true, pin: true },
      where: {
        id,
        projectId: this.context.projectId,
        deletedAt: null,
      },
    });

    if (!keyManagement) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    const isCorrectPin = await verify(keyManagement.pin, pin);

    if (!isCorrectPin) {
      throw new ForbiddenError('Pin mismatch');
    }

    await this.db.keyManagment.update({
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
}
