import { Repository } from '@key-master/db';
import { IAppContext } from '@key-master/graphql';
import { CreateProjectRoleInput } from '../codegen-generated';

export class ProjectRoleService extends Repository<IAppContext> {
  create(data: CreateProjectRoleInput) {
    return this.db.projectRole.create({
      data: {
        ...data,
        projectId: this.context.projectId,
      },
    });
  }
}
