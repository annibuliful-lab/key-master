import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const resolvers: Resolvers<IGraphqlContext> = {
  OrganizationKeyManagement: {
    keyManagement: (parent, _args, ctx) => {
      return ctx.keyManagementDataLoader.load(parent.keyManagementId);
    },
  },
};
