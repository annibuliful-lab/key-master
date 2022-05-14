import { userActivityKeyManagementQueueClient } from '@key-master/queue';
import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutations: Resolvers<IGraphqlContext>['Mutation'] = {
  createKeyManagement: async (_parent, { input }, ctx) => {
    const createdKey = await ctx.keyManagement.create(input);
    await userActivityKeyManagementQueueClient.add('CREATE', {
      keyManagementId: createdKey.id,
      name: createdKey.name,
      userId: createdKey.createdBy,
      createdAt: createdKey.createdAt,
    });

    return createdKey;
  },
  updateKeyManagement: async (_parent, { id, input }, ctx) => {
    const updatedKey = await ctx.keyManagement.update(id, input);
    await userActivityKeyManagementQueueClient.add('UPDATE', {
      keyManagementId: updatedKey.id,
      name: updatedKey.name,
      userId: updatedKey.createdBy,
      createdAt: updatedKey.createdAt,
    });
    return updatedKey;
  },
  updateKeyManagementPin: async (_parent, { id, input }, ctx) => {
    const updatedKeyPin = await ctx.keyManagement.updatePin(id, input);

    await userActivityKeyManagementQueueClient.add('UPDATE_PIN', {
      keyManagementId: updatedKeyPin.id,
      name: updatedKeyPin.name,
      userId: updatedKeyPin.createdBy,
      createdAt: updatedKeyPin.createdAt,
    });

    return updatedKeyPin;
  },
  deleteKeyMangement: async (_parent, { id, pin }, ctx) => {
    const deletedKey = await ctx.keyManagement.delete(id, pin);

    await userActivityKeyManagementQueueClient.add('DELETE', {
      keyManagementId: deletedKey.id,
      name: deletedKey.name,
      userId: deletedKey.createdBy,
      createdAt: deletedKey.createdAt,
    });

    return { success: true };
  },
};
