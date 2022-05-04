import { wrapSchema } from '@graphql-tools/wrap';
import { fetch } from 'cross-undici-fetch';
import {
  print,
  buildSchema,
  GraphQLSchema,
  getOperationAST,
  OperationTypeNode,
} from 'graphql';
import { AsyncExecutor, observableToAsyncIterable } from '@graphql-tools/utils';
import { createClient } from 'graphql-ws';
import WebSocket from 'ws';
interface IExecuteRemoteSchemaParam {
  httpEndpoint: string;
  wsEndpoint?: string;
}

export const executeRemoteSchema = async ({
  httpEndpoint,
  wsEndpoint,
}: IExecuteRemoteSchemaParam) => {
  let subscriptionClient = null;
  let wsExecutor: AsyncExecutor;

  if (wsEndpoint) {
    subscriptionClient = createClient({
      url: wsEndpoint,
      webSocketImpl: WebSocket,
    });

    wsExecutor = async ({ document, variables, operationName, extensions }) =>
      observableToAsyncIterable({
        subscribe: (observer) => ({
          unsubscribe: subscriptionClient.subscribe(
            {
              query: print(document),
              variables,
              operationName,
              extensions,
            },
            {
              next: (data) => observer.next && observer.next(data as unknown),
              error: (err) => {
                if (!observer.error) return;
                if (err instanceof Error) {
                  observer.error(err);
                } else if (err instanceof CloseEvent) {
                  observer.error(
                    new Error(`Socket closed with event ${err.code}`)
                  );
                } else if (Array.isArray(err)) {
                  // GraphQLError[]
                  observer.error(
                    new Error(err.map(({ message }) => message).join(', '))
                  );
                }
              },
              complete: () => observer.complete && observer.complete(),
            }
          ),
        }),
      });
  }

  const httpExecutor: AsyncExecutor = async ({
    document,
    variables,
    operationName,
    extensions,
  }) => {
    const query = typeof document === 'string' ? document : print(document);

    const fetchResult = await fetch(httpEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables, operationName, extensions }),
    });
    return fetchResult.json();
  };

  const executor: AsyncExecutor = async (args) => {
    // fetch schema stiching type from each service
    if ((args.document as unknown as string) === '{ _sdl }') {
      return httpExecutor(args);
    }

    const operation = getOperationAST(
      args.document,
      args.operationName ? args.operationName : undefined
    );

    if (
      operation?.operation === OperationTypeNode.SUBSCRIPTION &&
      !!wsEndpoint
    ) {
      return wsExecutor && wsExecutor(args);
    }

    return httpExecutor(args);
  };

  async function fetchRemoteSchema(executor): Promise<GraphQLSchema> {
    const result = await executor({ document: '{ _sdl }' });
    return buildSchema(result.data._sdl);
  }

  const schema = wrapSchema({
    schema: await fetchRemoteSchema(executor),
    executor,
  });

  return schema;
};
