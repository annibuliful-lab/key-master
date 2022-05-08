import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createOrganizationKeyManagement: (_parent, { input }, ctx) => {
    return ctx.organizationKeyManagement.create(input);
  },
  updateOrganizationKeyManagement: (_parent, { id, input }, ctx) => {
    return ctx.organizationKeyManagement.update(id, input);
  },
};
