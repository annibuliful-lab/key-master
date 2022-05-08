import { Resolvers } from '../../codegen-generated';
import { mutations as KeyManagementMutation } from './key-management.mutation';
import { mutations as OrganizationKeyManagementMutation } from './organization-key-management.mutation';

export const mutation: Resolvers['Mutation'] = {
  ...KeyManagementMutation,
  ...OrganizationKeyManagementMutation,
};
