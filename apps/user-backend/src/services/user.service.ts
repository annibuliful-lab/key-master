import { Repository } from '@key-master/db';
import { CreateUserInput } from '@key-master/graphql';
import { hash } from 'argon2';
export class UserService extends Repository {
  async createUser(data: CreateUserInput) {
    data.password = await hash(data.password);
    return this.db.user.create({ data });
  }
}
