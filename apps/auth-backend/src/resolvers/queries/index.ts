import { Resolvers } from '../../codegen-generated';
import { query as PermissionQuery } from './permission.query';
export const queries: Resolvers['Query'] = {
  ...PermissionQuery,
};
