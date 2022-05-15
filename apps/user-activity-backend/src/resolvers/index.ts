import { Resolvers } from '../codegen-generated';
import { fieldResolvers } from './fields';
import { mutations } from './mutations';
import { queries } from './queries';

export const resolvers: Resolvers = {
  Query: queries,
  Mutation: mutations,
  ...fieldResolvers,
};
