import { fastify } from 'fastify';
import { ApolloServer, Config, FastifyContext } from 'apollo-server-fastify';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { DocumentNode } from 'graphql';
const { allStitchingDirectivesTypeDefs, stitchingDirectivesValidator } =
  stitchingDirectives();

interface ICreateServer {
  typeDefs: Config['typeDefs'];
  port: number;
  resolvers: Config['resolvers'];
  enablePlayGround?: boolean;
  supportSchemaStiching?: boolean;
  context: (context: FastifyContext) => Config['context'];
}

export const createServer = async ({
  typeDefs,
  port,
  resolvers,
  enablePlayGround = true,
  supportSchemaStiching = true,
  context,
}: ICreateServer) => {
  console.log('resolvers', resolvers);
  const schema = supportSchemaStiching
    ? stitchingDirectivesValidator(
        makeExecutableSchema({
          typeDefs: [
            `
          ${allStitchingDirectivesTypeDefs}
          type Query {
            _sdl: String!
          }
        `,
            typeDefs,
          ],
          resolvers: {
            ...resolvers,
            Query: {
              ...(resolvers as any).Query,
              _sdl: () => {
                return (typeDefs as DocumentNode).loc.source.body;
              },
            },
          },
        })
      )
    : makeExecutableSchema({ typeDefs, resolvers });

  const apolloServer = new ApolloServer({
    schema,
    context,
    plugins: [
      enablePlayGround && ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  const app = fastify({});
  await apolloServer.start();

  app.register(apolloServer.createHandler({ path: '/graphql', cors: true }));

  app.listen(port, '0.0.0.0').then((url) => {
    console.log(`🚀  Server ready at ${url}/graphql `);
  });
};
