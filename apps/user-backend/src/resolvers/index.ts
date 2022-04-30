import { Resolvers } from '@key-master/graphql';
import { mutations } from './mutations';
import { query } from './queries';

export const resolvers: Resolvers = {
  Mutation: mutations,
  Query: query,
};
