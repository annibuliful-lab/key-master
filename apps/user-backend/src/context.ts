import { UserService } from './services/user.service';

export interface IGraphqlContext<T> {
  user: UserService<T>;
}
