import { createServer } from '@key-master/graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import * as dotenv from 'dotenv';
import { ProjectService } from './services/project.service';
import { ProjectRoleService } from './services/project-role.service';
import { projectRoleDataLoader } from './dataloaders/project-role.dataloader';
import { ProjectRolePermissionService } from './services/project-role-permission.service';

dotenv.config();

createServer({
  skipAuth: true,
  typeDefs,
  port: 3002,
  resolvers,
  contextResolver: (context) => {
    return {
      project: new ProjectService(context),
      projectRole: new ProjectRoleService(context),
      projectRolePermission: new ProjectRolePermissionService(context),
      projectRoleDataLoader,
    };
  },
});
