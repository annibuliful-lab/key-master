import { IAppContext } from '../../../libs/graphql/src';
import { UserActivityService } from './services/user-activity.service';

export interface IGraphqlContext extends IAppContext {
  userActivity: UserActivityService;
}
