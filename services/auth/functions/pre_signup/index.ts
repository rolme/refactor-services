import { DynamoDB } from 'aws-sdk';
import * as validator from 'validator';

const TRIAL_LENGTH_IN_DAYS = 14;

export const handler = async (event: any = {}): Promise<any> => {
  const email = event.request.userAttributes.email;

  if (email !== email.toLowerCase()) {
    throw new Error('Email must be lower case');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Email is invalid');
  }

  let rawEmail = email;
  if (event.request.userAttributes.hasOwnProperty('custom:rawEmail')) {
    rawEmail = event.request.userAttributes['custom:rawEmail'];
  }

  let role = 'guest';
  if (event.request.userAttributes.hasOwnProperty('custom:role')) {
    role = event.request.userAttributes['custom:role'];
  }

  let source = 'UNKNOWN';
  if (event.request.validationData) {
    source = event.request.validationData.source;
  }

  await createDynamoUser(rawEmail, event.userName, role, source);

  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;

  return event;
};

async function createDynamoUser(
  email: string,
  username: string,
  role: string,
  source: string,
) {
  const ddb = new DynamoDB.DocumentClient();
  const now = new Date().getTime();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + TRIAL_LENGTH_IN_DAYS);

  const data: { [key: string]: any } = {
    createdAt: now,
    email,
    hash: `USER-${username}`,
    id: `USER-${username}`,
    range: `USER-${username}`,
    role,
    scope: `TRIAL-${expiresAt.getTime().toString()}`,
    source,
    status: 'TRIAL',
    type: 'USER',
    updatedAt: now,
  };

  return ddb
    .put({
      Item: data,
      TableName: process.env.TABLE_REFACTOR!,
    })
    .promise()
    .catch((error) => console.log(error.toString()));
}
