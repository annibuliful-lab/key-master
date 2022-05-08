import { resolvers as ProjectRolePermissionFieldsResolvers } from './project-role-permission.field';
import { resolvers as ProjectOrganizationFieldsResolvers } from './project-organization.field';
import { resolvers as ProjectRoleUserFieldsResolvers } from './project-role-user.field';

export const fieldResolvers = {
  ...ProjectRolePermissionFieldsResolvers,
  ...ProjectOrganizationFieldsResolvers,
  ...ProjectRoleUserFieldsResolvers,
};
