import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createProjectTag: (_parent, { input }, ctx) => {
    return ctx.projectTag.create(input);
  },
  updateProjectTag: (_parent, { input, id }, ctx) => {
    return ctx.projectTag.update(id, input);
  },
  deleteProjectTag: async (_parent, { id }, ctx) => {
    await ctx.projectTag.delete(id);

    return { success: true };
  },
};
