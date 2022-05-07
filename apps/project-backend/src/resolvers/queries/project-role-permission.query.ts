import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getProjectRolePermissionsByRoleId: (_parent, { id }, ctx) => {
    return ctx.projectRolePermission.findByRoleId(id);
  },
};
