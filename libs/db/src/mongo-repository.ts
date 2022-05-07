import { PrismaClient } from '@prisma/client-mongo';
import { mongoClient } from './mongo-client';

export class MongoRepository<Context = never> {
  protected context: Context;
  protected db: PrismaClient;

  constructor(...params: Context extends never ? [] : [Context]) {
    this.context = params[0] as Context;
    this.db = mongoClient;
  }
}
