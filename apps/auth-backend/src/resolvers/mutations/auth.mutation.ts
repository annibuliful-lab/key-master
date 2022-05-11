import { createPublishEvent } from '@key-master/graphql';
import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutation: Resolvers<IGraphqlContext>['Mutation'] = {
  login: async (_parent, { input }, ctx) => {
    const logedUser = await ctx.auth.login(input);

    await createPublishEvent('LOGED_USER', { logedUser });

    return logedUser;
  },
  logout: (_parent, _args, ctx) => {
    return ctx.auth.logout();
  },
};
