import { keyBy } from 'lodash';
import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const query: Resolvers<IGraphqlContext>['Query'] = {
  getPermissionById: (_parent, { id }, ctx) => {
    return ctx.permission.findById(id);
  },
  getPermissions: (_parent, { filter }, ctx) => {
    return ctx.permission.findManyByFilter(filter);
  },
  _projectRoleUserPermission: async (_parent, { keys }, ctx) => {
    const ids = keys.map((key) => key.permissionId);
    const permissions = await ctx.permission.findByIds(ids);

    const groupedPermissions = keyBy(permissions, (user) => user.id);

    return ids.map((id) => {
      const permission = groupedPermissions[id];

      return {
        permissionId: id,
        permission,
      };
    });
  },
};
