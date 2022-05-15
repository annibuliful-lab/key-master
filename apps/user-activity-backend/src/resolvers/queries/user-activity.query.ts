import { Resolvers, ServiceName } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const queries: Resolvers<IGraphqlContext>['Query'] = {
  getUserActivityById: async (_parent, { id }, ctx) => {
    const activity = await ctx.userActivity.findById(id);
    return {
      ...activity,
      serviceName: activity.serviceName as ServiceName,
    };
  },
  getUsersActivities: async (_parent, { filter }, ctx) => {
    const activities = await ctx.userActivity.findManyByFilter(filter);
    return activities.map((activity) => ({
      ...activity,
      serviceName: activity.serviceName as ServiceName,
    }));
  },
};
