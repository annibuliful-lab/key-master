import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as UserActivitySchema } from './user-activity.schema';
import { typeDefs as KeyManagementActivitySchema } from './key-management-activity.schema';

export const typeDefs = mergeTypeDefs([
  UserActivitySchema,
  KeyManagementActivitySchema,
]);
