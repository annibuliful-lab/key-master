import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

export interface IGraphqlContext {
  user: UserService;
  auth: AuthService;
}
