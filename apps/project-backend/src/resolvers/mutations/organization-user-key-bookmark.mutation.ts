import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createOrganizationKeyManagementUserBookmark: (_parent, { input }, ctx) =>
    ctx.organizationUserKeyBookmark.create(input),
  deletedOrganizationKeyManagementUserBookmark: (_parent, { id }, ctx) =>
    ctx.organizationUserKeyBookmark.delete(id),
};
