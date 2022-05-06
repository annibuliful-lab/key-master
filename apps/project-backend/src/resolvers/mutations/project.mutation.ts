import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createProject: (_parent, { input }, ctx) => {
    return ctx.project.create(input);
  },
};
