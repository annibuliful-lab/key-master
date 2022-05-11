import { Resolvers } from '../codegen-generated';
import { mutations } from './mutations';
import { queries } from './queries';
import { subscriptions } from './subscriptions';

export const resolvers: Resolvers = {
  Mutation: mutations,
  Query: queries,
  Subscription: subscriptions,
};
