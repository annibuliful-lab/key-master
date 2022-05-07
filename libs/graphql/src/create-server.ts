import { fastify } from 'fastify';
import { ApolloServer, Config } from 'apollo-server-fastify';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  AuthenticationError,
  gql,
} from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { DocumentNode, print } from 'graphql';
import { IAppContext } from './graphql-context';
import {
  constraintDirectiveTypeDefs,
  constraintDirective,
} from 'graphql-constraint-directive';

const { allStitchingDirectivesTypeDefs, stitchingDirectivesValidator } =
  stitchingDirectives();

interface ICreateServer {
  typeDefs: Config['typeDefs'];
  port: number;
  resolvers: Config['resolvers'];
  enablePlayGround?: boolean;
  supportSchemaStiching?: boolean;
  skipAuth?: boolean;
  supportContastraintDirective?: boolean;
  contextResolver: (context: IAppContext) => Config['context'];
}

export const createServer = async ({
  typeDefs,
  port,
  resolvers,
  enablePlayGround = true,
  supportSchemaStiching = true,
  skipAuth = true,
  supportContastraintDirective = true,
  contextResolver,
}: ICreateServer) => {
  let schema = supportSchemaStiching
    ? stitchingDirectivesValidator(
        makeExecutableSchema({
          typeDefs: mergeTypeDefs([
            constraintDirectiveTypeDefs,
            typeDefs,
            gql`
              ${allStitchingDirectivesTypeDefs}
              type Query {
                _sdl: String!
              }
            `,
          ]),
          resolvers: mergeResolvers([
            resolvers as never,
            {
              Query: {
                _sdl: () => {
                  return `
                  ${allStitchingDirectivesTypeDefs}
                  ${constraintDirectiveTypeDefs}
                  ${print(typeDefs as DocumentNode)}`;
                },
              },
            },
          ]),
        })
      )
    : makeExecutableSchema({
        typeDefs: mergeTypeDefs([constraintDirectiveTypeDefs, typeDefs]),
        resolvers,
      });

  if (supportContastraintDirective) {
    schema = constraintDirective()(schema);
  }

  const apolloServer = new ApolloServer({
    schema,
    context: (context) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const operationName = (context.request.body as any)
        .operationName as string;
      if (operationName === 'IntrospectionQuery') {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sdlQuery = (context.request.body as any).query as string;
      if (sdlQuery === '{\n  _sdl\n}\n' || sdlQuery.includes('_sdl')) {
        return;
      }

      if (skipAuth) {
        return contextResolver({ userId: '', projectId: '', permissions: [] });
      }

      const userId = context.request.headers['x-user-id'] as string;
      if (!userId) {
        throw new AuthenticationError('x-user-id is required');
      }

      const projectId = context.request.headers['x-project-id'] as string;
      if (!projectId && !sdlQuery.includes('createProject')) {
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
