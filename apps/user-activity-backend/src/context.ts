import { IAppContext } from '@key-master/graphql';
import { UserActivityService } from './services/user-activity.service';

export interface IGraphqlContext extends IAppContext {
  userActivity: UserActivityService;
}
