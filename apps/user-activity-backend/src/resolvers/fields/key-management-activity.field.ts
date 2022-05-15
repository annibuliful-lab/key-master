import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const resolvers: Resolvers<IGraphqlContext> = {
  KeyManagement: {
    historyLogs: (parent, { filter }, ctx) => {
      return ctx.userActivity.findByIdWithPagination(
        parent.id,
        'KeyManagement',
        filter
      );
    },
  },
};
