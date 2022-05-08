import { Repository } from '@key-master/db';
import { DuplicateResouce, IAppContext } from '@key-master/graphql';
import { hash } from 'argon2';
import { CreateKeyManagementInput } from '../codegen-generated';

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
}
