import { executeRemoteSchema } from '@key-master/graphql';

import { stitchSchemas } from '@graphql-tools/stitch';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { fastify } from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

const { stitchingDirectivesTransformer } = stitchingDirectives();

async function makeGatewaySchema() {
  return stitchSchemas({
    subschemaConfigTransforms: [stitchingDirectivesTransformer],
    subschemas: [
      {
        schema: await executeRemoteSchema({
          wsEndpoint: 'ws://localhost:3000/graphql',
          httpEndpoint: 'http://localhost:3000/graphql',
        }),
      },
    ],
  });
}

const main = async () => {
  const typeDefs = await makeGatewaySchema();
  const apolloServer = new ApolloServer({
    typeDefs,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  const app = fastify({});
  await apolloServer.start();

  app.register(apolloServer.createHandler({ path: '/graphql', cors: true }));

  app.listen(4000, '0.0.0.0').then((url) => {
    console.log(`🚀  Server ready at ${url}/graphql `);
  });
};

main();
