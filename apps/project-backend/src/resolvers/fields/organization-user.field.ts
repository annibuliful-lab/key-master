import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const resolvers: Resolvers<IGraphqlContext> = {
  OrganizationUser: {
    organization: (parent, _args, ctx) => {
      return ctx.projectOrganizationDataLoader.load(parent.organizationId);
    },
  },
};
