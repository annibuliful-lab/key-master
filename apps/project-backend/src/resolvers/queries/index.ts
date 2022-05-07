import { Resolvers } from '../../codegen-generated';
import { queries as ProjectQuery } from './project.query';

export const queries: Resolvers['Query'] = {
  ...ProjectQuery,
};
