import { DynamoDB } from 'aws-sdk';
import * as validator from 'validator';

const ddb = new DynamoDB.DocumentClient();
const TRIAL_LENGTH_IN_DAYS = 14;

async function insertUser(
  email: string,
  userName: string,
  scope: string,
  trailLength: number,
) {
  const now = new Date().getTime();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + trailLength);

  const data: { [key: string]: any } = {
    admin: false,
    createdAt: now,
    disabled: false,
    email,
    entity: 'USER',
    expiresAt: expiresAt.getTime(),
    id: `USER-${userName}`,
    key: `USER-${userName}`,
    scope,
    status: 'TRIAL',
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

export const handler = async (event: any = {}): Promise<any> => {
  const email = event.request.userAttributes.email;

  if (email !== email.toLowerCase()) {
    throw new Error('Email must be lower case');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Email is invalid');
  }

  let source = 'UNKNOWN';
  let rawEmail = email;

  if (event.request.validationData) {
    rawEmail = event.request.validationData.rawEmail;
    source = event.request.validationData.source;
  }

  await insertUser(rawEmail, event.userName, source, TRIAL_LENGTH_IN_DAYS);

  // Auto confirm all users
  console.log('autoconfirming user:', event.userName);
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;

  return event;
};
