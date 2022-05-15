import { Resolvers } from '../codegen-generated';
import { fieldResolvers } from './fields';
import { queries } from './queries';

export const resolvers: Resolvers = {
  Query: queries,
  ...fieldResolvers,
};
