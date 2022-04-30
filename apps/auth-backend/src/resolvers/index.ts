import { Resolvers } from '@key-master/graphql';
import { mutations } from './mutations';

export const resolvers: Resolvers = {
  Mutation: mutations,
};
