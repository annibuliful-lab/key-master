import { ProjectService } from './services/project.service';

export interface IGraphqlContext {
  project: ProjectService;
}
