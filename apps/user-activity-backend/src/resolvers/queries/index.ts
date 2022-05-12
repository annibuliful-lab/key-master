import { Resolvers } from '../../codegen-generated';
import { queries as UserActivityQuery } from './user-activity.query';

export const queries: Resolvers['Query'] = {
  ...UserActivityQuery,
};
