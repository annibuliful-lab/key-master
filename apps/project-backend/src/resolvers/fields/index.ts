import { resolvers as ProjectRolePermissionFieldsResolvers } from './project-role-permission.field';
import { resolvers as ProjectOrganizationFieldsResolvers } from './project-organization.field';

export const fieldResolvers = {
  ...ProjectRolePermissionFieldsResolvers,
  ...ProjectOrganizationFieldsResolvers,
};
