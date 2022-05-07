import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutation: Resolvers<IGraphqlContext>['Mutation'] = {
  createPermission: (_parent, { permission }, ctx) => {
    return ctx.permission.create(permission);
  },
  updatePermission: (_parent, { id, permission }, ctx) => {
    return ctx.permission.update(id, permission);
  },
  deletePermission: async (_parent, { id }, ctx) => {
    return ctx.permission.delete(id);
  },
};
