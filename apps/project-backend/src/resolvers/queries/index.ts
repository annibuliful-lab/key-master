import { Resolvers } from '../../codegen-generated';
import { queries as ProjectQuery } from './project.query';
import { queries as ProjectRoleQuery } from './project-role.query';
export const queries: Resolvers['Query'] = {
  ...ProjectQuery,
  ...ProjectRoleQuery,
};
