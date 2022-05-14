import { AppProps } from 'next/app';
import Head from 'next/head';
import { apolloClient } from '../client/apollo-client';
import { ApolloProvider } from '@apollo/client';
import { GeistProvider, CssBaseline } from '@geist-ui/react';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Key master Dashboard</title>
      </Head>
      <ApolloProvider client={apolloClient}>
        <GeistProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </GeistProvider>
      </ApolloProvider>
    </>
  );
}

export default CustomApp;
