import * as Prisma from '@prisma/client';
import { prismaClient } from './prisma-client';

export class Repository<Context = never> {
  protected context: Context;
  protected db: Prisma.PrismaClient;

  constructor(...params: Context extends never ? [] : [Context]) {
    this.context = params[0] as Context;
    this.db = prismaClient;
  }
}
