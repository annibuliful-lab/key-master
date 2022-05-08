import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createOrganizationKeyManagement: (_parent, { input }, ctx) => {
    return ctx.organizationKeyManagement.create(input);
  },
};
