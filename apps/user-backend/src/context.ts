import { PermissionService } from './services/permission.service';
import { UserService } from './services/user.service';

export interface IGraphqlContext {
  user: UserService;
  permission: PermissionService;
}
