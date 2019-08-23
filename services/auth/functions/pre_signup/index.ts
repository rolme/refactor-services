import { DynamoDB } from 'aws-sdk';
import * as validator from 'validator';

const ddb = new DynamoDB.DocumentClient();

async function addUserToDdb(
  userName: string,
  email: string, // Email coming from end-user will be case-incensitive
  customerId: string,
) {
  // Set expiration date 14 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 14);

  const now = new Date().getTime();

  const data: { [key: string]: any } = {
    data: email.toLowerCase(),
    email,
    expiresAt: expiresAt.getTime(),
    id: `USER-${userName}`,
    updatedAt: now,
  };

  data.createdAt = now;
  data.sort = `${email.toLowerCase()}|${data.createdAt}`;

  console.log('inserting ddb record:', data);

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

  let rawEmail = email;

  console.log('event:', event.request.validationData);
  if (event.request.validationData) {
    rawEmail = event.request.validationData.rawEmail;
  }

  await addUserToDdb(event.userName, rawEmail, 'none');

  // Auto confirm all users
  console.log('autoconfirming user:', event.userName);
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;

  return event;
};
