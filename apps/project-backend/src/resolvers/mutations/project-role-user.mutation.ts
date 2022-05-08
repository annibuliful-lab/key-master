import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createProjectRoleUser: (_parent, { input }, ctx) => {
    return ctx.projectRoleUser;
  },
};
