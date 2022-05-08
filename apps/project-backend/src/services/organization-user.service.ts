import { Repository } from '@key-master/db';
import { IAppContext, ResourceNotFound } from '@key-master/graphql';
import { CreateOrganizationUserInput } from '../codegen-generated';

export class OrganizationUserService extends Repository<IAppContext> {
  async create(input: CreateOrganizationUserInput) {
    const organization = await this.db.projectOrganization.findFirst({
      select: { id: true },
      where: {
        deletedAt: null,
        id: input.organizationId,
        projectId: this.context.projectId,
      },
    });

    if (!organization) {
      throw new ResourceNotFound(
        `organization id ${input.organizationId} not found`
      );
    }

    const projectRoleUser = await this.db.projectRoleUser.findFirst({
      select: { id: true },
      where: {
        deletedAt: null,
        projectId: this.context.projectId,
        userId: input.userId,
        active: true,
      },
    });

    if (!projectRoleUser) {
      throw new ResourceNotFound(`user id ${input.userId} not found`);
    }

    return this.db.organizationUser.create({
      data: {
        ...input,
        createdBy: this.context.userId,
        updatedBy: this.context.userId,
      },
    });
  }
}
