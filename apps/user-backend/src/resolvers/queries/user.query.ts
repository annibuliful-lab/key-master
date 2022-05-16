import { mapDataWithIdsByCustomFieldId } from '@key-master/graphql';
import { ForbiddenError } from 'apollo-server-core';
import { keyBy } from 'lodash';
import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const query: Resolvers<IGraphqlContext>['Query'] = {
  me: async (_parent, _args, ctx) => {
    const user = await ctx.user.findByUserIdFromContext();
    if (!user) {
      throw new ForbiddenError('me: Forbidden');
    }
    return user;
  },
  _userProfile: async (_parent, { keys }, ctx) => {
    const ids = keys.map((key) => key.id);
    const users = await ctx.user.findByIds(ids);

    const groupedUsers = keyBy(users, (user) => user.id);

    return ids.map((id) => {
      const user = groupedUsers[id];

      return {
        id: id,
        user,
      };
    });
  },
  _projectRoleUserProfile: async (_parent, { keys }, ctx) => {
    const ids = keys.map((key) => key.userId);
    const users = await ctx.user.findByIds(ids);

    const groupedUsers = keyBy(users, (user) => user.id);

    return ids.map((id) => {
      const user = groupedUsers[id];
      return {
        userId: id,
        user,
      };
    });
  },
  _organizationUserProfile: async (_parent, { keys }, ctx) => {
    const ids = keys.map((key) => key.userId);
    const users = await ctx.user.findByIds(ids);

    const groupedUsers = keyBy(users, (user) => user.id);

    return ids.map((id) => {
      const user = groupedUsers[id];
      return {
        userId: id,
        user,
      };
    });
  },
  _userProfileActivity: async (_parent, { ids }, ctx) => {
    const users = await ctx.user.findByIds(ids);

    const groupedUsers = keyBy(users, (user) => user.id);

    return ids.map((id) => {
      const user = groupedUsers[id];
      return {
        userId: id,
        user,
      };
    });
  },
};
