import { createPublishEvent, pubsub, PubSubTopic } from '@key-master/graphql';
import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutation: Resolvers<IGraphqlContext>['Mutation'] = {
  createUser: async (_parent, { input }, ctx) => {
    const createdUser = await ctx.user.createUser(input);
    await createPublishEvent('CREATED_USER', { createdUser });

    return createdUser;
  },
};
