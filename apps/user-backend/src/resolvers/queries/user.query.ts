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
  users: (_parent, _input, ctx) => {
    return ctx.user.findAll();
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
};
