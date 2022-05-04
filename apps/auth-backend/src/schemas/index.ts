import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as AuthSchema } from './auth.schema';

export const typeDefs = mergeTypeDefs([AuthSchema]);
