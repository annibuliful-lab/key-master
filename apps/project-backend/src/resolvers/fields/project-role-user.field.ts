import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const resolvers: Resolvers<IGraphqlContext> = {
  ProjectRoleUser: {
    project: (parent, _args, ctx) => {
      return ctx.projectDataLoader.load(parent.projectId);
    },
    role: (parent, _args, ctx) => {
      return ctx.projectRoleDataLoader.load(parent.roleId);
    },
  },
};
