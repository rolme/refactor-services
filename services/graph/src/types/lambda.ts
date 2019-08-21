import { IncomingHttpHeaders } from 'http';

export type Context = Readonly<{
  awsRequestId: string;
  callbackWaitsForEmptyEventLoop: boolean;
  functionName: string;
  functionVersion: string;
  invokedFunctionArn: string;
  invokeid: string;
  logGroupName: string;
  logStreamName: string;
  memoryLimitInMB: number;
}>;

export type Event<Arguments = {}, Source = {}> = Readonly<{
  field: string;
  context: Readonly<{
    arguments: Arguments;
    identity: Readonly<{
      groups: string[] | null;
      issuer: string;
      sourceIp: string[];
      sub: string;
      username: string;
    }>;
    request: Readonly<{
      headers: IncomingHttpHeaders;
    }>;
    source: Readonly<Source>;
  }>;
}>;
