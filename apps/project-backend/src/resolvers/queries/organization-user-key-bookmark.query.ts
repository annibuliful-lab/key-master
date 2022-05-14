import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getOrganizationKeyManagementUserBookmarkById: (_parent, { id }, ctx) => {
    return ctx.organizationUserKeyBookmark.findById(id);
  },
  getOrganizationKeyManagementUserBookmarks: (_parent, { filter }, ctx) => {
    return ctx.organizationUserKeyBookmark.findManyByFilter(filter);
  },
};
