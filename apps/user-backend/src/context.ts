import { UserService } from './services/user.service';

export interface IGraphqlContext {
  user: UserService;
}
