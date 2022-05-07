import { Resolvers } from '../../codegen-generated';
import { mutations as ProjectMutation } from './project.mutation';
import { mutations as ProjectRoleMutation } from './project-role.mutation';

export const mutations: Resolvers['Mutation'] = {
  ...ProjectMutation,
  ...ProjectRoleMutation,
};
