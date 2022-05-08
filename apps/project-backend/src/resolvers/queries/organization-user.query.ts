import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getOrganizationUserById: (_parent, { id }, ctx) => {
    return ctx.organizationUser.findById(id);
  },
  getOrganizationUsers: (_parent, { filter }, ctx) => {
    return ctx.organizationUser.findManyByFilter(filter);
  },
};
