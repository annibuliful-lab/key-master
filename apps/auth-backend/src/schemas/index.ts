import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as AuthSchema } from './auth.schema';
import { typeDefs as PermissionSchema } from './permission.schema';

export const typeDefs = mergeTypeDefs([AuthSchema, PermissionSchema]);
