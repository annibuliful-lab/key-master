import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getProjectRolePermissionByRoleId: (_parent, { id }, ctx) => {
    return ctx.projectRolePermission.findByProjectRoleId(id);
  },
};
