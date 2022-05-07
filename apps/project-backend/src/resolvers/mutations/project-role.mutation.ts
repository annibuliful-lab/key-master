import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createProjectRole: (_parent, { input }, ctx) => {
    return ctx.projectRole.create(input);
  },
  updateProjectRole: (_parent, { id, input }, ctx) => {
    return ctx.projectRole.update(id, input);
  },
};
