import { createSubscriberEvent } from '@key-master/graphql';
import { Resolvers } from '../../codegen-generated';

export const subscriptions: Resolvers['Subscription'] = {
  logedUser: {
    subscribe: () => createSubscriberEvent('LOGED_USER'),
  },
};
