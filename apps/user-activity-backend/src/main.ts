import { createServer } from '@key-master/graphql';
import * as dotenv from 'dotenv';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import { IGraphqlContext } from './context';
import { UserActivityService } from './services/user-activity.service';

dotenv.config();

createServer({
  typeDefs,
  port: 3004,
  resolvers,
  contextResolver: (context): IGraphqlContext => {
    return { ...context, userActivity: new UserActivityService(context) };
  },
});
