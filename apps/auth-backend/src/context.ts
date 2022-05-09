import { IAppContext } from '@key-master/graphql';
import { AuthService } from './services/auth.service';
import { PermissionService } from './services/permission.service';

export interface IGraphqlContext extends IAppContext {
  auth: AuthService;
  permission: PermissionService;
}
