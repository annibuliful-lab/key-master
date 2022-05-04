import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutation: Resolvers<IGraphqlContext>['Mutation'] = {
  login: (_parent, { input }, ctx) => {
    return ctx.auth.login(input);
  },
};
