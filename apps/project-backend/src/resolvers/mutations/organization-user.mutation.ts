import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createOrganizationUser: (_parent, { input }, ctx) => {
    return ctx.organizationUser.create(input);
  },
};
