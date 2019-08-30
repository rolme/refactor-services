import { GraphQLClient } from 'graphql-request';
import { Config } from '../../toolbelt.config';

// Common client using typical authentication
export const client: any = new GraphQLClient(Config.toolbelt
  .appSyncApiUrl as string);

// Client used for queries and mutations that require api key auth
export const apiClient: any = new GraphQLClient(
  Config.toolbelt.appSyncApiUrl as string,
  { headers: { 'x-api-key': Config.toolbelt.appSyncApiKey as string } },
);
