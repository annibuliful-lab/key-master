import { createServer } from '@key-master/graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import { UserService } from './services/user.service';
import * as dotenv from 'dotenv';
import { IGraphqlContext } from './context';

dotenv.config();

createServer({
  typeDefs,
  port: 3000,
  resolvers,
  contextResolver: (context): IGraphqlContext => {
    return {
      ...context,
      user: new UserService(context),
    };
  },
});
