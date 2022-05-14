import { Resolvers } from '../../codegen-generated';
import { mutations as ProjectMutation } from './project.mutation';
import { mutations as ProjectRoleMutation } from './project-role.mutation';
import { mutations as ProjectRolePermissionMutation } from './project-role-permission.mutation';
import { mutations as ProjectOrganizationMutation } from './project-organization.mutation';
import { mutations as ProjectRoleUserMutation } from './project-role-user.mutation';
import { mutations as OrganizationUserMutation } from './organization-user.mutation';
import { mutations as OrganizationKeyManagementUserBookmark } from './organization-user-key-bookmark.mutation';

export const mutations: Resolvers['Mutation'] = {
  ...ProjectMutation,
  ...ProjectRoleMutation,
  ...ProjectRolePermissionMutation,
  ...ProjectOrganizationMutation,
  ...ProjectRoleUserMutation,
  ...OrganizationUserMutation,
  ...OrganizationKeyManagementUserBookmark,
};
