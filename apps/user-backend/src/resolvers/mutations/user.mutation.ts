import { pubsub, PubSubTopic } from '@key-master/graphql';
import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const mutation: Resolvers<IGraphqlContext>['Mutation'] = {
  createUser: async (_parent, { input }, ctx) => {
    const newUser = await ctx.user.createUser(input);
    await pubsub.publish(PubSubTopic.CREATED_USER, { createdUser: newUser });
    return newUser;
  },
};
