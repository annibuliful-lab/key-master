import { AsyncExecutor } from '@graphql-tools/utils';
import { fetch } from 'cross-undici-fetch';
import { print } from 'graphql';

export function makeRemoteExecutor(url: string): AsyncExecutor {
  return async ({ document, variables }) => {
    const query = print(document);
    const fetchResult = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
  };
}
