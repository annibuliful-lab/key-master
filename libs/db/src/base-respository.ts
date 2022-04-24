import * as Prisma from '@prisma/client';
import { prismaClient } from './prismaClient';

export class Repository<Context = never> {
  context: Context;
  db: Prisma.PrismaClient;

  constructor(...params: Context extends never ? [] : [Context]) {
    this.context = params[0] as Context;
    this.db = prismaClient;
  }
}
