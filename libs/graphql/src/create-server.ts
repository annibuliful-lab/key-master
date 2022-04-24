import { fastify } from 'fastify';
import { ApolloServer, Config } from 'apollo-server-fastify';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

interface ICreateServer {
  typeDefs: Config['typeDefs'];
  port: number;
  enablePlayGround?: boolean;
}

export const createServer = async ({
  typeDefs,
  port,
  enablePlayGround = true,
}: ICreateServer) => {
  const apolloServer = new ApolloServer({
    typeDefs,
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
