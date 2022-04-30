import { createServer } from '@key-master/graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import { UserService } from './services/user.service';
import * as dotenv from 'dotenv';

dotenv.config();

createServer({
  typeDefs,
  port: 3000,
  resolvers,
  contextResolver: (context) => {
    return {
      user: new UserService(context),
    };
  },
});
