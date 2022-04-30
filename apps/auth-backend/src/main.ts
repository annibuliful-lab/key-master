import { createServer } from '@key-master/graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import { AuthService } from './services/auth.service';
import * as dotenv from 'dotenv';

dotenv.config();

createServer({
  typeDefs,
  port: 3001,
  resolvers,
  contextResolver: (context) => {
    return {
      auth: new AuthService(context),
    };
  },
});
