import { fastify } from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import GraphQLVoyagerFastify from 'graphql-voyager-fastify-plugin';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';

import waitOn from 'wait-on';
import * as dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeGatewaySchema } from './make-gateway-schema';
import { IGatewayContext, validateWsAuthentication } from './validate-ws-auth';
import { validateHttpAuth } from './validate-http-auth';

dotenv.config();

const main = async () => {
  const enablePlayGround =
    process.env.ENABLE_GRAPHQL_SERVER_PLAYGROUND === 'true';

  const enableVoyager = process.env.ENABLE_GRAPHQL_SERVER_VOYAGER === 'true';

  const schema = await makeGatewaySchema();

  const app = fastify({});
  const wsServer = new WebSocketServer({
    server: app.server,
    path: '/graphql',
  });

  const serverCleanup = useServer(
    {
      schema,
      onConnect: async (
        ctx
      ): Promise<Record<string, unknown> | boolean | void> => {
        const headers = ctx.connectionParams as unknown as IGatewayContext;
        return await validateWsAuthentication(headers);
      },
      onSubscribe: async (ctx) => {
        const headers = ctx.connectionParams as unknown as IGatewayContext;
        await validateWsAuthentication(headers);
      },
    },
    wsServer
  );

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      enablePlayGround && ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: validateHttpAuth,
  });

  await apolloServer.start();

  app.register(apolloServer.createHandler({ path: '/graphql', cors: true }));

  if (enableVoyager) {
    app.register(GraphQLVoyagerFastify, {
      path: '/voyager',
      endpoint: '/graphql',
    });
  }

  app.listen(4000, '0.0.0.0').then((url) => {
    console.log(`🚀  Server ready at ${url}/graphql `);
  });

  process.on('SIGTERM', async () => {
    await app.close();
    await apolloServer.stop();
  });
};

waitOn(
  { resources: [3000, 3001, 3002, 3003, 3004].map((port) => `tcp:${port}`) },
  (error) => {
    if (error) {
      console.error('Gateway error ', error);
      return;
    }

    main();
  }
);
