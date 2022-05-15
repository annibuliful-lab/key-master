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
import { OrganizationKeyManagementUserBookmarkService } from './services/organization-user-key-bookmark.service';
import { ProjectTagService } from './services/project-tag.service';
import { projectTagDataLoader } from './dataloaders/project-tag.dataloader';

export interface IGraphqlContext extends IAppContext {
  project: ProjectService;
  projectRole: ProjectRoleService;
  projectRolePermission: ProjectRolePermissionService;
  projectOrganization: ProjectOrganizationService;
  projectRoleUser: ProjectRoleUserService;
  organizationUser: OrganizationUserService;
  organizationUserKeyBookmark: OrganizationKeyManagementUserBookmarkService;
  projectTag: ProjectTagService;
  projectRoleDataLoader: typeof projectRoleDataLoader;
  projectDataLoader: typeof projectDataLoader;
  projectOrganizationDataLoader: typeof projectOrganizationDataLoader;
  projectTagDataLoader: typeof projectTagDataLoader;
}
