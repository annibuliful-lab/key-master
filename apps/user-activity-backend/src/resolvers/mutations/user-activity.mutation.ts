import { Resolvers, ServiceName } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createUserActivity: async (_parent, { input }, ctx) => {
    const created = await ctx.userActivity.create(input);

    return {
      ...created,
      serviceName: created.serviceName as ServiceName,
    };
  },
};
