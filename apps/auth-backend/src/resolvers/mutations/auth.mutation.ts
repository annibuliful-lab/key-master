import { userActivityPublisherQueueClient } from '@key-master/queue';
import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutation: Resolvers<IGraphqlContext>['Mutation'] = {
  login: async (_parent, { input }, ctx) => {
    const logedUser = await ctx.auth.login(input);
    await userActivityPublisherQueueClient.add('USER_LOGIN', logedUser);
    return logedUser;
  },
  logout: (_parent, _args, ctx) => {
    return ctx.auth.logout();
  },
};
