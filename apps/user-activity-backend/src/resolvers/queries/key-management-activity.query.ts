import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  _keyManagementActivity: async (_parent, { ids }) => {
    return ids.map((id) => {
      return {
        id,
      };
    });
  },
};
