import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getProjectRoleUserById: (_parent, { id }, ctx) => {
    return ctx.projectRoleUser.findById(id);
  },
  getProjectRoleUsers: (_parent, { filter }, ctx) => {
    return ctx.projectRoleUser.findManyByFilter(filter);
  },
};
