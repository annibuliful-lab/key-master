import { Resolvers } from '../codegen-generated';
import { fieldResolvers } from './fields';
import { mutation } from './mutations';
import { query } from './queries';

export const resolvers: Resolvers = {
  Mutation: mutation,
  Query: query,
  ...fieldResolvers,
};
