import { Resolvers } from '../codegen-generated';
import { mutations } from './mutations/project.mutation';
import { queries } from './queries/project.query';

export const resolvers: Resolvers = {
  Mutation: mutations,
  Query: queries,
};
