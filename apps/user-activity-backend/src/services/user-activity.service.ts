import { MongoRepository } from '@key-master/db';
import { IAppContext } from '@key-master/graphql';
import { UserActivityFilterInput } from '../codegen-generated';

export class UserActivityService extends MongoRepository<IAppContext> {
  findById(id: string) {
    return this.db.userActivity.findUnique({
      where: {
        id,
      },
    });
  }

  findManyByFilter(filter: UserActivityFilterInput) {
    return this.db.userActivity.findMany({
      ...(filter?.cursor && { skip: 1 }),
      ...(filter?.cursor && {
        cursor: {
          id: filter?.cursor,
        },
      }),
      where: {
        ...(filter?.search && {
          description: {
            contains: filter?.search,
            mode: 'insensitive',
          },
        }),
        ...(filter?.type?.length && {
          type: {
            in: filter?.type,
          },
        }),
        ...(filter?.projectId && {
          projectId: filter?.projectId,
        }),
        ...(filter?.serviceName && {
          serviceName: filter?.serviceName,
        }),
      },
      orderBy: {
        id: 'asc',
      },
      take: filter?.take ?? 20,
    });
  }
}
