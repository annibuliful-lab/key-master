import { createServer } from '@key-master/graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import * as dotenv from 'dotenv';
import { ProjectService } from './services/project.service';
import { ProjectRoleService } from './services/project-role.service';

dotenv.config();

createServer({
  skipAuth: false,
  typeDefs,
  port: 3002,
  resolvers,
  contextResolver: (context) => {
    return {
      project: new ProjectService(context),
      projectRole: new ProjectRoleService(context),
    };
  },
});
