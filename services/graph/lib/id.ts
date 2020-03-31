import { DynamoDB } from 'aws-sdk';
import { ItemType } from 'graph/src/types';

export async function getId(type: ItemType) {
  const timestamp = new Date().getTime().toString();
  const id = await counter();
  return `${type}-${timestamp}-gql-${id}`;
}


async function counter() {
  const docClient = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
  const p = await docClient
    .update({
      ExpressionAttributeNames: {
        '#v': 'currentValue',
      },
      ExpressionAttributeValues: {
        ':a': 1.0,
        ':s': 0.0,
      },
      Key: {
        varName: 'sequenceNo',
      },
      ReturnValues: 'UPDATED_NEW',
      TableName: process.env.TABLE_ATOMICVARS || 'AtomicVars',
      UpdateExpression: 'SET #v = if_not_exists(#v, :s) + :a',
    })
    .promise();
  // counter should return value between 0000-9999
  const value = p.Attributes ? p.Attributes.currentValue % 10000 : 1;
  return value.toString().padStart(4, '0');
}

export function isMatchingIdType(id:string, type:ItemType) {
  if (!id.startsWith(`${type}-`)) {
    throw new Error(`${id} is not a valid id for item type ${type}`);
  }
}