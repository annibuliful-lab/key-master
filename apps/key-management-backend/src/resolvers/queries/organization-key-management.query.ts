import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getOrganizationKeyManagementById: (_parent, { id }, ctx) => {
    return ctx.organizationKeyManagement.findById(id);
  },
};
