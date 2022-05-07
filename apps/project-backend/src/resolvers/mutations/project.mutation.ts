import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createProject: (_parent, { input }, ctx) => {
    return ctx.project.create(input);
  },
  updateProject: (_parent, { id, input }, ctx) => {
    return ctx.project.updateProject(id, input);
  },
  deleteProject: (_parent, { id }, ctx) => {
    return ctx.project.deleteProject(id);
  },
};
