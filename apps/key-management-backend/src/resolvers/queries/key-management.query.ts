import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getKeyManagementById: (_parent, { id }, ctx) => {
    return ctx.keyManagement.findById(id);
  },
};