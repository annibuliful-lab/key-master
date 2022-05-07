import { stitchSchemas } from '@graphql-tools/stitch';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { fastify } from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
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
    ],
  });
}

const main = async () => {
  const schema = await makeGatewaySchema();

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: async ({ request }) => {
      const token = request.headers['authorization']?.replace('Bearer ', '');

      if (!token) {
        return null;
      }

      const projectId = request.headers['x-project-id'] as string;
      const userId = request.headers['x-user-id'] as string;
      const userAuth = await validateAuthentication({ token, projectId });

      if (typeof userAuth === 'string' && userAuth === 'FORBIDDEN') {
        throw new ForbiddenError(`Forbidden with project id ${projectId}`);
      }

      if (!userAuth) {
        throw new AuthenticationError('Unauthorization');
      }

      return {
        'x-user-id': userId,
        'x-project-id': projectId,
      };
    },
  });
  const app = fastify({});
  await apolloServer.start();

  app.register(apolloServer.createHandler({ path: '/graphql', cors: true }));

  app.listen(4000, '0.0.0.0').then((url) => {
    console.log(`🚀  Server ready at ${url}/graphql `);
  });
};

waitOn(
  { resources: [3000, 3001, 3002].map((port) => `tcp:${port}`) },
  (error) => {
    if (error) {
      console.error('Gate-way-error ', error);
      return;
    }

    main();
  }
);
