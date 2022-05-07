import { Resolvers } from '../codegen-generated';
import { mutations } from './mutations';
import { queries } from './queries';
import { fieldResolvers } from './fields';

export const resolvers: Resolvers = {
  Mutation: mutations,
  Query: queries,
  ...fieldResolvers,
};
