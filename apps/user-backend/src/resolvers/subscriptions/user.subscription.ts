import { createSubscriberEvent } from '@key-master/graphql';
import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const subscription: Resolvers<IGraphqlContext>['Subscription'] = {
  createdUser: {
    subscribe: () => createSubscriberEvent('CREATED_USER'),
  },
};
