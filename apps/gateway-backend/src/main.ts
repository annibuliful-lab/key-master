import { stitchSchemas } from '@graphql-tools/stitch';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { fastify } from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import GraphQLVoyagerFastify from 'graphql-voyager-fastify-plugin';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server-core';
import {
  executeRemoteSchema,
  validateAuthentication,
} from '@key-master/graphql';
const { stitchingDirectivesTransformer } = stitchingDirectives();
import waitOn from 'wait-on';
import * as dotenv from 'dotenv';

dotenv.config();

async function makeGatewaySchema() {
  const userSchema = await executeRemoteSchema({
    httpEndpoint: 'http://localhost:3000/graphql',
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
  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      enablePlayGround && ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: async ({ request }): Promise<IGatewayContext> => {
      const authorization = request.headers['authorization'];
      const allowTestSecret = request.headers['x-allow-test'] as string;
      const projectId = request.headers['x-project-id'] as string;
      const userId = request.headers['x-user-id'] as string;
      const permissions = request.headers['x-user-permissions'] as string;
      if (
        authorization?.startsWith('TEST-AUTH') &&
        allowTestSecret === process.env.SKIP_AUTH_SECRET
      ) {
        return {
          'x-user-id': userId,
          'x-project-id': projectId,
          'x-user-permissions': permissions.split(','),
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

  const app = fastify({});
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
