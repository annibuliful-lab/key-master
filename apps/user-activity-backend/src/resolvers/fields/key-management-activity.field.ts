import { Resolvers, ServiceName } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const resolvers: Resolvers<IGraphqlContext> = {
  KeyManagement: {
    historyLogs: async (parent, { filter }, ctx) => {
      const historyLogs = await ctx.userActivity.findByIdWithPagination(
        parent.id,
        'KeyManagement',
        filter
      );

      return historyLogs.map((history) => ({
        ...history,
        serviceName: history.serviceName as ServiceName,
      }));
    },
  },
};
