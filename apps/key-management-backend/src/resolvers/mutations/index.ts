import { Resolvers } from '../../codegen-generated';
import { mutations as KeyManagementMutation } from './key-management.mutation';
export const mutation: Resolvers['Mutation'] = {
  ...KeyManagementMutation,
};
