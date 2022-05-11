import { Resolvers } from '../../codegen-generated';
import { subscription as UserSubscription } from './user.subscription';

export const subscription: Resolvers['Subscription'] = {
  ...UserSubscription,
};
