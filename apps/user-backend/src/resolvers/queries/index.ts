import { Resolvers } from '../../codegen-generated';
import { query as UserQuery } from './user.query';
import { query as PermissionQuery } from './permission';

export const queries: Resolvers['Query'] = {
  ...UserQuery,
  ...PermissionQuery,
};
