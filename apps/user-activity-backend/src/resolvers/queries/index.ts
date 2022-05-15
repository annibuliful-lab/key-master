import { Resolvers } from '../../codegen-generated';
import { queries as UserActivityQuery } from './user-activity.query';
import { queries as KeyManagementActivityQuery } from './key-management-activity.query';

export const queries: Resolvers['Query'] = {
  ...UserActivityQuery,
  ...KeyManagementActivityQuery,
};
