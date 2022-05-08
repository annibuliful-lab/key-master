import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const resolvers: Resolvers<IGraphqlContext> = {
  ProjectOrganization: {
    project: (parent, _args, ctx) => {
      return ctx.projectDataLoader.load(parent.projectId);
    },
  },
};
