import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createOrganizationUser: (_parent, { input }, ctx) => {
    return ctx.organizationUser.create(input);
  },
  updateOrganizationUser: (_parent, { id, input }, ctx) => {
    return ctx.organizationUser.update(id, input);
  },
  deleteOrganizationUser: (_parent, { id }, ctx) => {
    return ctx.organizationUser.delete(id);
  },
};
