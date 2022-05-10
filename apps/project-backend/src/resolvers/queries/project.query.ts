import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getProjectById: (_parent, { id }, ctx) => {
    return ctx.project.findById(id);
  },
  getProjectsByOwner: (_parent, _args, ctx) => {
    return ctx.project.findManyByOwner();
  },
};
