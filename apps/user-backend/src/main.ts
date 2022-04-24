import { createServer } from '@key-master/graphql';
import { FastifyContext } from 'apollo-server-fastify';
import { resolvers } from './resolvers';
import { UserService } from './services/user.service';
import { typeDefs } from './user.schema';

createServer({
  typeDefs,
  port: 3000,
  resolvers,
  context: (context) => {
    return {
      user: new UserService<FastifyContext>(context),
    };
  },
});
