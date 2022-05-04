import { typeDefs as UserSchema } from './user.schema';
import { mergeTypeDefs } from '@graphql-tools/merge';
export const typeDefs = mergeTypeDefs([UserSchema]);
