import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const resolvers: Resolvers<IGraphqlContext> = {
  Project: {
    tags: (parent, _args, ctx) => {
      return ctx.projectTagDataLoader.load(parent.id);
    },
  },
};
