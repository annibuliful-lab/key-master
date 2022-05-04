import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutation: Resolvers<IGraphqlContext>['Mutation'] = {
  createUser: (_parent, { input }, ctx) => {
    return ctx.user.createUser(input);
  },
};
