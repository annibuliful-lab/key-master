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
import { decryptMaterKey, encryptMasterKey } from '../utils/key-encryption';

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

    const hashPassword = await hash(input.pin);

    input.pin = hashPassword;

    const {
      content: masterKey,
      secretHash,
      key,
      iv,
    } = await encryptMasterKey({ text: input.masterKey, secret: hashPassword });

    return this.db.keyManagment.create({
      data: {
        ...input,
        projectId: this.context.projectId,
        masterKey,
        masterKeyIv: `${secretHash}:${iv}`,
        secretHash: `${key}:${secretHash}`,
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

  async findById(id: string) {
    const keyManagement = await this.db.keyManagment.findFirst({
      select: { id: true, name: true, projectId: true, pin: true },
      where: {
        id,
        projectId: this.context.projectId,
        deletedAt: null,
      },
    });

    if (!keyManagement) {
      throw new ResourceNotFound(`id ${id} not found`);
    }

    return keyManagement;
  }

  findByIds(ids: string[]) {
    return this.db.keyManagment.findMany({
      select: { id: true, name: true, projectId: true, pin: true },
      where: {
        id: {
          in: [...new Set(ids)],
        },
        projectId: this.context.projectId,
        deletedAt: null,
      },
    });
  }

  async getMasterKey(id: string, pin: string) {
    const keyManagement = await this.db.keyManagment.findUnique({
      select: {
        masterKey: true,
        pin: true,
        masterKeyIv: true,
        secretHash: true,
      },
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

    const iv = keyManagement.masterKeyIv.split(':')[1];
    const secretHash = keyManagement.secretHash.split(':')[1];

    const content = keyManagement.masterKey;
    const decryptKey = decryptMaterKey({
      hash: {
        iv,
        content,
      },
      secretHash,
    });

    return decryptKey;
  }
}
