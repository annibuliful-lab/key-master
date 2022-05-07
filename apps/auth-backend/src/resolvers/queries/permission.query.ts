import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const query: Resolvers<IGraphqlContext>['Query'] = {
  getPermissionById: (_parent, { id }, ctx) => {
    return ctx.permission.findById(id);
  },
  getPermissions: (_parent, { filter }, ctx) => {
    return ctx.permission.findManyByFilter(filter);
  },
};
