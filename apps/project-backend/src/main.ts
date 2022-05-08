import { createServer } from '@key-master/graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import * as dotenv from 'dotenv';
import { ProjectService } from './services/project.service';
import { ProjectRoleService } from './services/project-role.service';
import { projectRoleDataLoader } from './dataloaders/project-role.dataloader';
import { ProjectRolePermissionService } from './services/project-role-permission.service';
import { ProjectOrganizationService } from './services/project-organization.service';
import { IGraphqlContext } from './context';
import { projectDataLoader } from './dataloaders/project.dataloader';

dotenv.config();

createServer({
  skipAuth: false,
  typeDefs,
  port: 3002,
  resolvers,
  contextResolver: (context): IGraphqlContext => {
    return {
      project: new ProjectService(context),
      projectRole: new ProjectRoleService(context),
      projectRolePermission: new ProjectRolePermissionService(context),
      projectOrganization: new ProjectOrganizationService(context),
      projectRoleDataLoader,
      projectDataLoader,
    };
  },
});
