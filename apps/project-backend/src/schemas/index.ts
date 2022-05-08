import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as ProjectSchema } from './project.schema';
import { typeDefs as ProjectRoleSchema } from './project-role.schema';
import { typeDefs as ProjectRolePermissionSchema } from './project-role-permission.schema';
import { typeDefs as ProjectOrganizationSchema } from './project-organization.schema';
import { typeDefs as ProjectRoleUserSchema } from './project-role-user.schema';

export const typeDefs = mergeTypeDefs([
  ProjectOrganizationSchema,
  ProjectSchema,
  ProjectRoleSchema,
  ProjectRolePermissionSchema,
  ProjectRoleUserSchema,
]);
