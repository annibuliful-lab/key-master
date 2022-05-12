import { MongoRepository } from '@key-master/db';
import { IAppContext } from '@key-master/graphql';

export class UserActivityService extends MongoRepository<IAppContext> {
  findById(id: string) {
    return this.db.userActivity.findUnique({
      where: {
        id,
      },
    });
  }
}
