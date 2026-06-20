import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? 'http://localhost:3001/graphql';

/**
 * Single shared Apollo Client instance for the browser. The default cache
 * normalizes by `id`, so mutations that return updated entities keep the
 * UI in sync automatically.
 */
export function createApolloClient(): ApolloClient<unknown> {
  return new ApolloClient({
    link: new HttpLink({ uri: endpoint }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
    },
  });
}

export const apolloClient = createApolloClient();
