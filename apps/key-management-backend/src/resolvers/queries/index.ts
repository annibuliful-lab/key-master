import { Resolvers } from '../../codegen-generated';
import { queries as KeyManagementQuery } from './key-management.query';

export const query: Resolvers['Query'] = {
  ...KeyManagementQuery,
};
