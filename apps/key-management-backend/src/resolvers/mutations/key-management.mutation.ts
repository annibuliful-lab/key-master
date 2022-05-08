import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createKeyManagement: (_parent, { input }, ctx) => {
    return ctx.keyManagement.create(input);
  },
};
