import { stitchSchemas } from '@graphql-tools/stitch';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { fastify } from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import GraphQLVoyagerFastify from 'graphql-voyager-fastify-plugin';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server-core';
import {
  executeRemoteSchema,
  getUserPermissions,
  validateAuthentication,
} from '@key-master/graphql';
const { stitchingDirectivesTransformer } = stitchingDirectives();
import waitOn from 'wait-on';
import * as dotenv from 'dotenv';
import { isEmpty } from 'lodash';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

dotenv.config();

async function makeGatewaySchema() {
  const userSchema = await executeRemoteSchema({
    httpEndpoint: 'http://localhost:3000/graphql',
    wsEndpoint: 'ws://localhost:3000/graphql',
  });

  const authSchema = await executeRemoteSchema({
    httpEndpoint: 'http://localhost:3001/graphql',
  });

  const projectSchema = await executeRemoteSchema({
    httpEndpoint: 'http://localhost:3002/graphql',
  });

  const keyManagementSchema = await executeRemoteSchema({
    httpEndpoint: 'http://localhost:3003/graphql',
  });

  return stitchSchemas({
    subschemaConfigTransforms: [stitchingDirectivesTransformer],
    subschemas: [
      {
        schema: userSchema,
      },
      {
        schema: authSchema,
      },
      {
        schema: projectSchema,
      },
      {
        schema: keyManagementSchema,
      },
    ],
  });
}

interface IGatewayContext {
  'x-user-id': string;
  'x-project-id': string;
  'x-user-permissions': string[];
  'x-user-role': string;
  authorization: string;
}

const main = async () => {
  const enablePlayGround =
    process.env.ENABLE_GRAPHQL_SERVER_PLAYGROUND === 'true';

  const enableVoyager = process.env.ENABLE_GRAPHQL_SERVER_VOYAGER === 'true';

  const schema = await makeGatewaySchema();

  const app = fastify({});
  const server = new WebSocketServer({
    server: app.server,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, server);

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
    context: async ({ request }): Promise<IGatewayContext> => {
      const authorization = request.headers['authorization'];
      const allowTestSecret = request.headers['x-allow-test'] as string;
      const projectId = request.headers['x-project-id'] as string;
      const userId = request.headers['x-user-id'] as string;
      const permissions = (request.headers['x-user-permissions'] ??
        '') as string;

      if (
        authorization?.startsWith('TEST-AUTH') &&
        allowTestSecret === process.env.SKIP_AUTH_SECRET
      ) {
        return {
          'x-user-id': userId,
          'x-project-id': projectId,
          'x-user-permissions': !isEmpty(permissions)
            ? permissions.split(',')
            : (
                await getUserPermissions({
                  projectId,
                  userId,
                })
              ).permissions,
          'x-user-role': 'KeyAdmin',
          authorization,
        };
      }

      const token = authorization?.replace('Bearer ', '');

      if (!token) {
        return null;
      }

      const userAuth = await validateAuthentication({ token, projectId });

      if (typeof userAuth === 'string' && userAuth === 'FORBIDDEN') {
        throw new ForbiddenError(`Forbidden with project id ${projectId}`);
      }

      if (!userAuth) {
        throw new AuthenticationError('Unauthorization');
      }

      return {
        'x-user-id': userAuth.userId,
        'x-project-id': projectId,
        'x-user-permissions': userAuth.permissions,
        'x-user-role': userAuth.role,
        authorization,
      };
    },
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
};

waitOn(
  { resources: [3000, 3001, 3002, 3003].map((port) => `tcp:${port}`) },
  (error) => {
    if (error) {
      console.error('Gateway error ', error);
      return;
    }

    main();
  }
);
