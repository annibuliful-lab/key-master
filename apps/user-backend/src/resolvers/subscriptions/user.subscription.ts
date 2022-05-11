import { pubsub, PubSubTopic } from '@key-master/graphql';
import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const subscription: Resolvers<IGraphqlContext>['Subscription'] = {
  createdUser: {
    subscribe: (_parent, _args, ctx) =>
      pubsub.asyncIterator(PubSubTopic.CREATED_USER) as any,
  },
};
