import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

export interface ITestUser {
  email: string;
  id?: string;
  password: string;
  token?: string;
}

export const config = yaml.safeLoad(
  fs.readFileSync(__dirname + '/../../config.yml', 'utf8'),
);

const cognito = new CognitoIdentityServiceProvider({
  region: config.jest.awsRegion,
});

export async function createUser(newUser: ITestUser): Promise<string> {
  const createResult = await cognito
    .adminCreateUser({
      MessageAction: 'SUPPRESS',
      TemporaryPassword: newUser.password,
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: 'admin',
        },
      ],
      UserPoolId: config.jest.cognitoUserPoolId,
      Username: newUser.email,
    })
    .promise();

  if (!createResult || !createResult.User) {
    return Promise.reject('Unable to create user.');
  }

  return `USER-${createResult.User.Username}`;
}

export async function loginUser(testUser: ITestUser): Promise<string> {
  const loginResult = await cognito
    .adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        PASSWORD: testUser.password,
        USERNAME: testUser.email,
      },
      ClientId: config.jest.cognitoUserPoolClientId,
      UserPoolId: config.jest.cognitoUserPoolId,
    })
    .promise();

  if (!loginResult || !loginResult.Session) {
    return Promise.reject('Unable to login in user.');
  }

  const challengeResult = await cognito
    .adminRespondToAuthChallenge({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        NEW_PASSWORD: testUser.password,
        USERNAME: testUser.email,
      },
      ClientId: config.jest.cognitoUserPoolClientId,
      Session: loginResult.Session,
      UserPoolId: config.jest.cognitoUserPoolId,
    })
    .promise();

  if (!challengeResult || !challengeResult.AuthenticationResult) {
    return Promise.reject('Login challenge failed.');
  }

  if (!challengeResult.AuthenticationResult.IdToken) {
    return Promise.reject('Did not receive a login token.');
  }

  return challengeResult.AuthenticationResult.IdToken;
}
