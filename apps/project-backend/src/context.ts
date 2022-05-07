import { ProjectRolePermissionService } from './services/project-role-permission.service';
import { ProjectRoleService } from './services/project-role.service';
import { ProjectService } from './services/project.service';
import { projectRoleDataLoader } from './dataloaders/project-role.dataloader';
export interface IGraphqlContext {
  project: ProjectService;
  projectRole: ProjectRoleService;
  projectRolePermission: ProjectRolePermissionService;
  projectRoleDataLoader: typeof projectRoleDataLoader;
}
