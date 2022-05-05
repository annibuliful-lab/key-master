import { Repository } from '@key-master/db';
import { IAppContext } from '@key-master/graphql';
import { hash } from 'argon2';
import { CreateUserInput } from '../codegen-generated';
export class UserService extends Repository<IAppContext> {
  async createUser(data: CreateUserInput) {
    data.password = await hash(data.password);

    return this.db.user.create({ data });
  }

  findByIds(ids: string[]) {
    return this.db.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  findAll() {
    return this.db.user.findMany();
  }
}
