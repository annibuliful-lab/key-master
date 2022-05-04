import { Resolvers } from '../codegen-generated';
import { mutations } from './mutations';

export const resolvers: Resolvers = {
  Mutation: mutations,
};
