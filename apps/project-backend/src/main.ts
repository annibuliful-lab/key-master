import { createServer } from '@key-master/graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import * as dotenv from 'dotenv';
import { ProjectService } from './services/project.service';

dotenv.config();

createServer({
  typeDefs,
  port: 3001,
  resolvers,
  contextResolver: (context) => {
    return {
      project: new ProjectService(context),
    };
  },
});
