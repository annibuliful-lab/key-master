import { createServer } from '@key-master/graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import { AuthService } from './services/auth.service';
import * as dotenv from 'dotenv';
import { PermissionService } from './services/permission.service';

dotenv.config();

createServer({
  typeDefs,
  port: 3001,
  resolvers,
  contextResolver: (context) => {
    return {
      auth: new AuthService(context),
      permission: new PermissionService(context),
    };
  },
});
