import { GraphQLClient } from 'graphql-request';

// Common client using typical authentication
export const client: any = new GraphQLClient(process.env
  .GRAPHQL_API_URL as string);

// Client used for queries and mutations that require api key auth
export const apiClient: any = new GraphQLClient(
  process.env.GRAPHQL_API_URL as string,
  { headers: { 'x-api-key': process.env.APPSYNC_API_KEY as string } },
);
