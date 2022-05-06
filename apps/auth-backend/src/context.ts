import { AuthService } from './services/auth.service';
import { PermissionService } from './services/permission.service';

export interface IGraphqlContext {
  auth: AuthService;
  permission: PermissionService;
}
