import { MongoRepository } from '@key-master/db';
import { IAppContext } from '@key-master/graphql';
import {
  CreateUserActivityInput,
  KeyManagementHistoryLogFilterInput,
  UserActivityFilterInput,
} from '../codegen-generated';

export class UserActivityService extends MongoRepository<IAppContext> {
  create(data: CreateUserActivityInput) {
    return this.db.userActivity.create({
      data: {
        parentPkId: data.parentPkId,
        userId: data.userId,
        description: data.description,
        serviceName: data.serviceName,
        type: data.type,
        data: data.data,
      },
    });
  }

  findById(id: string) {
    return this.db.userActivity.findUnique({
      where: {
        id,
      },
    });
  }

  findByIdWithPagination(
    parentPkId: string,
    serviceName: string,
    filter: KeyManagementHistoryLogFilterInput
  ) {
    return this.db.userActivity.findMany({
      where: {
        parentPkId,
        serviceName,
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip: filter?.skip ?? 0,
      take: filter?.take ?? 20,
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
        ...(filter?.parentPkId && {
          parentPkId: filter?.parentPkId,
        }),
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
