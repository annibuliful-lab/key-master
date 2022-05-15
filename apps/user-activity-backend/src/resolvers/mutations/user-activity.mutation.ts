import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createUserActivity: (_parent, { input }, ctx) => {
    return ctx.userActivity.create(input);
  },
};
