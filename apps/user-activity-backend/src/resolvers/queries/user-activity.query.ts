import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getUserActivityById: (_parent, { id }, ctx) => {
    return ctx.userActivity.findById(id);
  },
};
