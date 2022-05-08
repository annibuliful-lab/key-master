import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const resolvers: Resolvers<IGraphqlContext> = {
  ProjectRolePermission: {
    role: (parent, _args, ctx) => {
      return ctx.projectRoleDataLoader.load(parent.roleId);
    },
  },
};
