import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const resolvers: Resolvers<IGraphqlContext> = {
  OrganizationKeyManagementUserBookmark: {
    projectOrganization: (parent, _args, ctx) =>
      ctx.projectOrganizationDataLoader.load(parent.projectOrganizationId),
  },
};
