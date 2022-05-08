import { Resolvers } from '../../codegen-generated';
import { queries as KeyManagementQuery } from './key-management.query';
import { queries as OrganizationKeyManagementQuery } from './organization-key-management.query';

export const query: Resolvers['Query'] = {
  ...KeyManagementQuery,
  ...OrganizationKeyManagementQuery,
};
