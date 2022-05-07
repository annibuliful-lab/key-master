import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as ProjectSchema } from './project.schema';
import { typeDefs as ProjectRoleSchema } from './project-role.schema';
import { typeDefs as ProjectRolePermissionSchema } from './project-role-permission.schema';

export const typeDefs = mergeTypeDefs([
  ProjectSchema,
  ProjectRoleSchema,
  ProjectRolePermissionSchema,
]);
