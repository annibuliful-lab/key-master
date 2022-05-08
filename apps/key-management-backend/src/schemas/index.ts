import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as KeyManagementSchema } from './key-management.schema';
import { typeDefs as OrganizationKeyManagementSchema } from './organization-key-management.schema';

export const typeDefs = mergeTypeDefs([
  KeyManagementSchema,
  OrganizationKeyManagementSchema,
]);
