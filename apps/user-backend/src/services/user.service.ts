import { Repository } from '@key-master/db';
import { DuplicateResource, IAppContext } from '@key-master/graphql';
import { hash } from 'argon2';
import { CreateUserInput } from '../codegen-generated';
export class UserService extends Repository<IAppContext> {
  async createUser(data: CreateUserInput) {
    const user = await this.db.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (user) {
      throw new DuplicateResource(`duplicated username ${data.username}`);
    }

    data.password = await hash(data.password);

    return this.db.user.create({ data });
  }

  findByIds(ids: string[]) {
    return this.db.user.findMany({
      where: {
        id: {
          in: [...new Set(ids)],
        },
      },
    });
  }

  findByUserIdFromContext() {
    return this.db.user.findUnique({
      where: {
        id: this.context.userId,
      },
    });
  }
}
