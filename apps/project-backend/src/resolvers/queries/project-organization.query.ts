import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getProjectOrganizationById: (_parent, { id }, ctx) => {
    return ctx.projectOrganization.findById(id);
  },
  getProjectOrganizations: (_parent, { filter }, ctx) => {
    return ctx.projectOrganization.findManyByFilter(filter);
  },
};
