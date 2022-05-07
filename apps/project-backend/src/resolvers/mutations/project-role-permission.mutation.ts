import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  setProjectRolePermissions: (_parent, { input }, ctx) => {
    return ctx.projectRolePermission.setRolePermissions(input);
  },
};
