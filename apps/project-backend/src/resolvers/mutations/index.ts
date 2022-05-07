import { Resolvers } from '../../codegen-generated';
import { mutations as ProjectMutation } from './project.mutation';
import { mutations as ProjectRoleMutation } from './project-role.mutation';
import { mutations as ProjectRolePermissionMutation } from './project-role-permission.mutation';
import { mutations as ProjectOrganizationMutation } from './project-organization.mutation';

export const mutations: Resolvers['Mutation'] = {
  ...ProjectMutation,
  ...ProjectRoleMutation,
  ...ProjectRolePermissionMutation,
  ...ProjectOrganizationMutation,
};
