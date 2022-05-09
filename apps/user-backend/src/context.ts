import { IAppContext } from '@key-master/graphql';
import { UserService } from './services/user.service';

export interface IGraphqlContext extends IAppContext {
  user: UserService;
}
