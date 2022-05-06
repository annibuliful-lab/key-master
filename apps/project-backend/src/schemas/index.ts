import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as ProjectSchema } from './project.schema';

export const typeDefs = mergeTypeDefs([ProjectSchema]);
