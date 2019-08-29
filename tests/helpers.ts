import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import fetch from 'node-fetch';
import { v4 } from 'uuid';

export const cfg = yaml.safeLoad(
  fs.readFileSync(__dirname + '/../exports.yml', 'utf8'),
);

const cognito = new CognitoIdentityServiceProvider({
  region: cfg.jest.cognitoUserPoolId.substring(0, 9),
});

export const user: any = {
  email: getTestEmail(),
};

jest.setTimeout(20000);

beforeAll(async () => {
  const password = v4();

  return cognito
    .adminCreateUser({
      MessageAction: 'SUPPRESS',
      TemporaryPassword: password,
      UserPoolId: cfg.jest.cognitoUserPoolId,
      Username: user.email,
    })
    .promise()
    .then((data) => {
      if (data && data.User) {
        user.id = data.User.Username;
      }
      return cognito
        .adminInitiateAuth({
          AuthFlow: 'ADMIN_NO_SRP_AUTH',
          AuthParameters: {
            PASSWORD: password,
            USERNAME: user.email,
          },
          ClientId: cfg.jest.cognitoUserPoolClientId,
          UserPoolId: cfg.jest.cognitoUserPoolId,
        })
        .promise();
    })
    .then((data) => {
      return cognito
        .adminRespondToAuthChallenge({
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          ChallengeResponses: {
            NEW_PASSWORD: password,
            USERNAME: user.email,
          },
          ClientId: cfg.jest.cognitoUserPoolClientId,
          Session: data.Session,
          UserPoolId: cfg.jest.cognitoUserPoolId,
        })
        .promise();
    })
    .then((data) => {
      if (data.AuthenticationResult && data.AuthenticationResult.IdToken) {
        user.token = data.AuthenticationResult.IdToken;
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
});

afterAll(async () => {
  const result = await graphQuery('mutation { deleteUser { id email } }');
  expect(result.data).not.toBeUndefined();
  expect(result.data).toHaveProperty('deleteUser');
  expect(result.data.deleteUser).toHaveProperty('id');
  expect(result.data.deleteUser.id).toEqual(`USER-${user.id}`);
  expect(result.data.deleteUser).toHaveProperty('email');
  expect(result.data.deleteUser.email).toEqual(user.email);
});

export async function graphQuery(
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
    options.headers['x-api-key'] = cfg.jest.appSyncApiKey;
  } else {
    options.headers.Authorization = user.token;
  }
  const result = await fetch(cfg.jest.appSyncApiUrl, options);
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
  expect(json.errors).toBeUndefined();
  expect(json.data).not.toBeUndefined();
  expect(json.data).not.toBeNull();
  return json;
}

export async function graphQueryNoCheck(
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
    options.headers['x-api-key'] = cfg.jest.appSyncApiKey;
  } else {
    options.headers.Authorization = user.token;
  }
  const result = await fetch(cfg.jest.appSyncApiUrl, options);
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
  return result.json();
}

export function getTestEmail() {
  return 'qa_test+' + v4() + '@ricohtours.com';
}
