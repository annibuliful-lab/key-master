import { Resolvers } from '../codegen-generated';
import { mutations } from './mutations';
import { queries } from './queries';
import { subscription } from './subscriptions';

export const resolvers: Resolvers = {
  Mutation: mutations,
  Query: queries,
  Subscription: subscription,
};
