import { Resolvers } from '@key-master/graphql';
import { groupBy } from 'lodash';
import { IGraphqlContext } from '../../context';

export const query: Resolvers<IGraphqlContext>['Query'] = {
  users: (_parent, _input, ctx) => {
    return ctx.user.findAll();
  },
  _userProfile: async (_parent, { keys }, ctx) => {
    const ids = keys.map((key) => key.id);
    const users = await ctx.user.findByIds(ids);
    const groupedUsers = groupBy(users, (user) => user.id);
    return keys.map((key) => {
      const user = groupedUsers[key.id][0];

      return {
        id: key.id,
        user,
      };
    }) as any;
  },
};
