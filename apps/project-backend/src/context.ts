import { ProjectRoleService } from './services/project-role.service';
import { ProjectService } from './services/project.service';

export interface IGraphqlContext {
  project: ProjectService;
  projectRole: ProjectRoleService;
}
