import { createServer } from '@key-master/graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import { UserService } from './services/user.service';
import * as dotenv from 'dotenv';
import { PermissionService } from './services/permission.service';

dotenv.config();

createServer({
  typeDefs,
  port: 3000,
  resolvers,
  contextResolver: (context) => {
    return {
      user: new UserService(context),
      permission: new PermissionService(context),
    };
  },
});
