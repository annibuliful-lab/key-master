import { ProjectRolePermissionService } from './services/project-role-permission.service';
import { ProjectRoleService } from './services/project-role.service';
import { ProjectService } from './services/project.service';
import { projectRoleDataLoader } from './dataloaders/project-role.dataloader';
import { ProjectOrganizationService } from './services/project-organization.service';
import { projectDataLoader } from './dataloaders/project.dataloader';
import { ProjectRoleUserService } from './services/project-role-user.service';
import { OrganizationUserService } from './services/organization-user.service';
import { projectOrganizationDataLoader } from './dataloaders/project-organization.dataloader';
import { IAppContext } from '@key-master/graphql';

export interface IGraphqlContext extends IAppContext {
  project: ProjectService;
  projectRole: ProjectRoleService;
  projectRolePermission: ProjectRolePermissionService;
  projectOrganization: ProjectOrganizationService;
  projectRoleUser: ProjectRoleUserService;
  organizationUser: OrganizationUserService;
  projectRoleDataLoader: typeof projectRoleDataLoader;
  projectDataLoader: typeof projectDataLoader;
  projectOrganizationDataLoader: typeof projectOrganizationDataLoader;
}
