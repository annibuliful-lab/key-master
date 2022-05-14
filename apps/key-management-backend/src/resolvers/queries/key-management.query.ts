import { keyBy } from 'lodash';
import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getKeyManagementById: (_parent, { id }, ctx) => {
    return ctx.keyManagement.findById(id);
  },
  getKeyManagementByIds: (_parent, { ids }, ctx) => {
    return ctx.keyManagement.findByIds(ids);
  },
  _organizationUserKeyBookmark: async (_parent, { ids }, ctx) => {
    const keysManagement = await ctx.keyManagement.findByIds(ids);

    const groupedKey = keyBy(keysManagement, (key) => key.id);

    return ids.map((id) => {
      const keyManagement = groupedKey[id];

      return {
        keyManagementId: id,
        keyManagement,
      };
    });
  },
};
