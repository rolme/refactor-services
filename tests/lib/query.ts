import * as fs from 'fs';
import * as yaml from 'js-yaml';
import fetch from 'node-fetch';
import { ITestUser } from './auth';

const config = yaml.safeLoad(
  fs.readFileSync(__dirname + '/../../exports.yml', 'utf8'),
);

export async function gql(
  user: ITestUser,
  query: string,
  variables?: object,
  apiKey?: boolean,
) {
  const options: { [k: string]: any } = {
    body: JSON.stringify({ query, variables }),
    headers: {
      'Content-Type': 'appplication/json',
    },
    method: 'POST',
  };
  if (apiKey) {
    options.headers['x-api-key'] = config.jest.appSyncApiKey;
  } else {
    options.headers.Authorization = user.token;
  }
  const result = await fetch(config.jest.appSyncApiUrl, options);
  if (result.status !== 200) {
    throw new Error(
      'Unexpected HTTP status: ' +
        result.status +
        ', response: ' +
        (await result.text()) +
        ', options: ' +
        JSON.stringify(options),
    );
  }
  const json = await result.json();
  return json;
}
