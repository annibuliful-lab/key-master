import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getOrganizationKeyManagementUserBookmarkById: (_parent, { id }, ctx) =>
    ctx.organizationUserKeyBookmark.findById(id),
};
