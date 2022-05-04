import { fastify } from 'fastify';
import { ApolloServer, Config } from 'apollo-server-fastify';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  AuthenticationError,
} from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { mergeResolvers } from '@graphql-tools/merge';
import { DocumentNode, print } from 'graphql';

import { IAppContext } from './graphql-context';
const { allStitchingDirectivesTypeDefs, stitchingDirectivesValidator } =
  stitchingDirectives();

interface ICreateServer {
  typeDefs: Config['typeDefs'];
  port: number;
  resolvers: Config['resolvers'];
  enablePlayGround?: boolean;
  supportSchemaStiching?: boolean;
  skipAuth?: boolean;
  contextResolver: (context: IAppContext) => Config['context'];
}

export const createServer = async ({
  typeDefs,
  port,
  resolvers,
  enablePlayGround = true,
  supportSchemaStiching = true,
  skipAuth = true,
  contextResolver,
}: ICreateServer) => {
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
          resolvers: mergeResolvers([
            resolvers as any,
            {
              Query: {
                _sdl: () => {
                  return `
                  ${allStitchingDirectivesTypeDefs}
                  ${print(typeDefs as DocumentNode)}`;
                },
              },
            },
          ]),
        })
      )
    : makeExecutableSchema({ typeDefs, resolvers });

  const apolloServer = new ApolloServer({
    schema,
    context: (context) => {
      if (skipAuth) {
        return contextResolver({ userId: '', projectId: '', permissions: [] });
      }

      const userId = context.request.headers['x-user-id'] as string;
      if (!userId) {
        throw new AuthenticationError('x-user-id is required');
      }
      const projectId = context.request.headers['x-project-id'] as string;
      if (!projectId) {
        throw new AuthenticationError('x-project-id is required');
      }

      return contextResolver({ userId, projectId, permissions: [] });
    },
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
