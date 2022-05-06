import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getProjectById: (_parent, { id }, ctx) => {
    return ctx.project.getById(id);
  },
};
