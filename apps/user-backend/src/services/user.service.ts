import { Repository } from '@key-master/db';
import { CreateUserInput, IAppContext } from '@key-master/graphql';
import { hash } from 'argon2';
export class UserService extends Repository<IAppContext> {
  async createUser(data: CreateUserInput) {
    data.password = await hash(data.password);
    return this.db.user.create({ data });
  }

  async findAll() {
    return this.db.user.findMany();
  }
}
