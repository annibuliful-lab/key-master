import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getProjectRoleById: (_parent, { id }, ctx) => {
    return ctx.projectRole.findById(id);
  },
};
