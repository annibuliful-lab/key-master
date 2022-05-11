import { Resolvers } from '../../codegen-generated';
import { subscriptions as AuthSubscription } from './auth.subscription';

export const subscriptions: Resolvers['Subscription'] = {
  ...AuthSubscription,
};
