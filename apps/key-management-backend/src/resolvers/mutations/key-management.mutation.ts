import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createKeyManagement: (_parent, { input }, ctx) => {
    return ctx.keyManagement.create(input);
  },
  updateKeyManagement: (_parent, { id, input }, ctx) => {
    return ctx.keyManagement.update(id, input);
  },
  updateKeyManagementPin: (_parent, { id, input }, ctx) => {
    return ctx.keyManagement.updatePin(id, input);
  },
  deleteKeyMangement: (_parent, { id, pin }, ctx) => {
    return ctx.keyManagement.delete(id, pin);
  },
};
