import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createOrganizationKeyManagementUserBookmark: (_parent, { input }, ctx) => {
    return ctx.organizationUserKeyBookmark.create(input);
  },
  deletedOrganizationKeyManagementUserBookmark: (_parent, { id }, ctx) => {
    return ctx.organizationUserKeyBookmark.delete(id);
  },
};
