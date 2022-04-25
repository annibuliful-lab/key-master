import { Resolvers } from '@key-master/graphql';
import { IGraphqlContext } from '../../context';

export const mutation: Resolvers<IGraphqlContext>['Mutation'] = {
  createUser: (_parent, { input }, ctx) => {
    return ctx.user.createUser(input);
  },
};
