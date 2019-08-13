import { DynamoDB } from 'aws-sdk';

const ddb = new DynamoDB.DocumentClient();

async function addUserToDdb(
  userName: string,
  email: string,
  customerId: string,
  createdAt: number | undefined,
) {
  // Set expiration date 14 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 14);

  const now = new Date().getTime();

  const data: { [key: string]: any } = {
    id: userName,
    email: email,
    expiresAt: expiresAt.getTime(),
    updatedAt: now,
  };

  if (createdAt) {
    data.createdAt = createdAt;
  } else {
    data.createdAt = now;
  }

  console.log('inserting ddb record:', data);

  return ddb
    .put({
      TableName: process.env.TABLE_USERS!,
      Item: data,
    })
    .promise()
    .catch((error) => console.log(error.toString()));
}

export const handler = async (event: any = {}): Promise<any> => {
  console.log('event:', event);

  let migration;
  let createdAt;

  if (event.request.validationData && event.request.validationData.migration) {
    console.log('migration user:', event.userName);
    migration = JSON.parse(event.request.validationData.migration);
    console.log('migration data:', migration);
  }

  if (migration && migration.createdAt) {
    createdAt = migration.createdAt;
  }

  await addUserToDdb(
    event.userName,
    event.request.userAttributes.email,
    'none',
    createdAt,
  );

  // Auto confirm all users
  console.log('autoconfirming user:', event.userName);
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;

  return event;
};
