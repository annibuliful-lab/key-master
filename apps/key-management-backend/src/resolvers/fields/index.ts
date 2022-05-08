import { Resolvers } from '../../codegen-generated';
import { resolvers as KeyManagementFieldsResolvers } from './key-management.field';
import { resolvers as OrganizationKeyManagementFieldsResolvers } from './organization-key-management.field';

export const fieldResolvers: Resolvers = {
  ...KeyManagementFieldsResolvers,
  ...OrganizationKeyManagementFieldsResolvers,
};
