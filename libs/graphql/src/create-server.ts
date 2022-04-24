import { fastify } from 'fastify';
import { ApolloServer, Config } from 'apollo-server-fastify';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

interface ICreateServer {
  typeDefs: Config['typeDefs'];
  port: number;
  resolvers: Config['resolvers'];
  enablePlayGround?: boolean;
  context: Config['context'];
}

export const createServer = async ({
  typeDefs,
  port,
  resolvers,
  context,
  enablePlayGround = true,
}: ICreateServer) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    plugins: [
      enablePlayGround && ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  const app = fastify({});
  await apolloServer.start();

  app.register(apolloServer.createHandler({ path: '/graphql', cors: true }));

  app.listen(port, '0.0.0.0').then((url) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};
