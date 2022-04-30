import { wrapSchema, introspectSchema } from '@graphql-tools/wrap';
import { fetch } from 'cross-undici-fetch';
import { print, getOperationAST, OperationTypeNode } from 'graphql';
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
    // get the operation node of from the document that should be executed
    const operation = getOperationAST(args.document, args.operationName);
    // subscription operations should be handled by the wsExecutor
    if (
      operation?.operation === OperationTypeNode.SUBSCRIPTION &&
      !!wsEndpoint
    ) {
      return wsExecutor && wsExecutor(args);
    }
    // all other operations should be handles by the httpExecutor
    return httpExecutor(args);
  };

  const schema = wrapSchema({
    schema: await introspectSchema(executor),
    executor,
  });

  return schema;
};
