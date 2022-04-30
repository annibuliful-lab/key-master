import { AuthService } from './services/auth.service';

export interface IGraphqlContext {
  auth: AuthService;
}
