import { fastify } from 'fastify';
import { ApolloServer, Config } from 'apollo-server-fastify';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
  gql,
} from 'apollo-server-core';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { DocumentNode, GraphQLError, print } from 'graphql';
import { IAppContext } from './graphql-context';
import {
  constraintDirectiveTypeDefs,
  constraintDirective,
} from 'graphql-constraint-directive';
import { accessDirective } from './directives/access';
import { deleteOperationTypeDef } from './type-defs/delete-operation-result';
import { authorizedDirective } from './directives/authorized';
import compose from 'lodash/fp/compose';
import * as dotenv from 'dotenv';
import { DuplicateResource } from './errors/duplicate-resource';
import { WebSocketServer } from 'ws';

dotenv.config();

const { allStitchingDirectivesTypeDefs, stitchingDirectivesValidator } =
  stitchingDirectives();

const { accessdDirectiveTypeDefs, aceessDirectiveValidator } =
  accessDirective();

const { authorizedDirectiveTypeDefs, authorizedDirectiveValidator } =
  authorizedDirective();

interface ICreateServer {
  typeDefs: Config['typeDefs'];
  port: number;
  resolvers: Config['resolvers'];
  enablePlayGround?: boolean;
  supportSchemaStiching?: boolean;
  skipAuth?: boolean;
  supportContastraintDirective?: boolean;
  supportSubscription?: boolean;
  contextResolver: (context: IAppContext) => Config['context'];
}

function formatError(error: GraphQLError) {
  const errorCode = error.extensions.exception.code;
  if (errorCode === 'P2002') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metaFields = (error.extensions.exception as any).meta
      .target as string[];
    throw new DuplicateResource(`Duplicated ${metaFields}`);
  }

  return error;
}

export const createServer = async ({
  typeDefs,
  port,
  resolvers,
  supportSchemaStiching = true,
  supportContastraintDirective = true,
  supportSubscription = false,
  contextResolver,
}: ICreateServer) => {
  const enablePlayGround =
    process.env.ENABLE_GRAPHQL_SERVER_PLAYGROUND === 'true';

  let schema = supportSchemaStiching
    ? stitchingDirectivesValidator(
        makeExecutableSchema({
          typeDefs: mergeTypeDefs([
            constraintDirectiveTypeDefs,
            typeDefs,
            gql`
              ${accessdDirectiveTypeDefs}
              ${allStitchingDirectivesTypeDefs}
              ${constraintDirectiveTypeDefs}
              ${deleteOperationTypeDef}
              ${authorizedDirectiveTypeDefs}
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
                  ${accessdDirectiveTypeDefs}
                  ${constraintDirectiveTypeDefs}
                  ${authorizedDirectiveTypeDefs}
                  ${print(typeDefs as DocumentNode)}`;
                },
              },
            },
          ]),
        })
      )
    : makeExecutableSchema({
        typeDefs: mergeTypeDefs([
          constraintDirectiveTypeDefs,
          accessdDirectiveTypeDefs,
          constraintDirectiveTypeDefs,
          deleteOperationTypeDef,
          authorizedDirectiveTypeDefs,
          typeDefs,
        ]),
        resolvers,
      });

  if (supportContastraintDirective) {
    schema = constraintDirective()(schema);
  }

  schema = compose(
    aceessDirectiveValidator,
    authorizedDirectiveValidator
  )(schema);

  const app = fastify({});
  let serverCleanup = null;
  if (supportSubscription) {
    const server = new WebSocketServer({
      server: app.server,
      path: '/graphql',
    });

    serverCleanup = useServer({ schema }, server);
  }

  const apolloServer = new ApolloServer({
    schema,
    context: (context) => {
      const userId = context.request.headers['x-user-id'] as string;
      const projectId = context.request.headers['x-project-id'] as string;
      const permissions = context.request.headers[
        'x-user-permissions'
      ] as string;
      const userRole = context.request.headers['x-user-role'] as string;
      const orgId = context.request.headers['x-org-id'] as string;

      return contextResolver({
        userId,
        projectId,
        permissions: (permissions ?? '').split(','),
        role: userRole,
        orgId,
      });
    },
    plugins: [
      enablePlayGround && ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              if (serverCleanup) {
                await serverCleanup.dispose();
              }
            },
          };
        },
      },
    ],
    formatError,
  });

  await apolloServer.start();

  app.register(
    apolloServer.createHandler({
      path: '/graphql',
      cors: true,
      disableHealthCheck: true,
    })
  );

  app.listen(port, '0.0.0.0').then((url) => {
    console.log(`🚀  Server ready at ${url}/graphql `);
  });
};
