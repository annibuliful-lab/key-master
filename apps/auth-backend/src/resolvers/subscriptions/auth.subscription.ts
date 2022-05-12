import { subscribeRedisEvent } from '@key-master/graphql';
import { Resolvers } from '../../codegen-generated';

export const subscriptions: Resolvers['Subscription'] = {
  logedUser: {
    subscribe: () => subscribeRedisEvent('LOGED_USER'),
  },
};
