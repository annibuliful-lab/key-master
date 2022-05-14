import { AppProps } from 'next/app';
import Head from 'next/head';
import { apolloClient } from '../client/apollo-client';
import { ApolloProvider } from '@apollo/client';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Key master Dashboard</title>
      </Head>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
}

export default CustomApp;
