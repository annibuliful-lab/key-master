import { Resolvers } from '../codegen-generated';
import { mutation } from './mutations';

export const resolvers: Resolvers = {
  Mutation: mutation,
};
