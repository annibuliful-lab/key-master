import { ApolloClient, InMemoryCache } from '@apollo/client';
const uri =
  process.env.NODE_ENV === 'development' ? 'http://localhost:4000/graphql' : '';

export const apolloClient = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
});
