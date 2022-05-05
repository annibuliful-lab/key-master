import { typeDefs as UserSchema } from './user.schema';
import { typeDefs as PermissionSchema } from './permission.schema';

import { mergeTypeDefs } from '@graphql-tools/merge';
export const typeDefs = mergeTypeDefs([UserSchema, PermissionSchema]);
