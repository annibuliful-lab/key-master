import { IAppContext } from '@key-master/graphql';
import { UserService } from './services/user.service';
import { PubSub } from 'graphql-subscriptions';

export interface IGraphqlContext extends IAppContext {
  user: UserService;
}
