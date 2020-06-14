import { DynamoDB } from 'aws-sdk';
import { IHash, IModel } from 'types';
export { AttributeMap } from 'aws-sdk/clients/dynamodb';

const dynamodb = new DynamoDB({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION || 'us-west-2',
});

export const deleteItem = async (
  TableName: string,
  hash: string,
  range: string
): Promise<void> => {
  const params = {
    Key: {
      hash: { S: hash },
      range: { S: range }
    },
    TableName,
  };

  // NOTE: Delete does not return anything
  await dynamodb.deleteItem(params).promise();
};

export const getItem = async (
  TableName: string,
  hash: string,
  range: string,
): Promise<DynamoDB.GetItemOutput> => {
  const params = {
    Key: {
      hash: { S: hash },
      range: { S: range }
    },
    TableName,
  };

  return dynamodb.getItem(params).promise();
};

export const marshall = (
  data: { [key: string]: any },
  options?: DynamoDB.DocumentClient.ConverterOptions,
): DynamoDB.AttributeMap => {
  return DynamoDB.Converter.marshall(data, options);
};

export const put = async (
  TableName: string,
  Item: DynamoDB.PutItemInputAttributeMap & any,
): Promise<DynamoDB.PutItemOutput> => {
  const docClient = new DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION || 'us-west-2',
  });
  const putObject = {
    Item,
    TableName,
  };

  // NOTE: DocumentClient#put does not return anything.
  await docClient.put(putObject).promise();
  return Item;
};

export const query = async (
  TableName: string,
  hash: string,
  range?: string,
): Promise<DynamoDB.QueryOutput> => {
  const conditions = ['#hash = :hash'];
  const ExpressionAttributeNames: { [name: string]: any } = { '#hash': 'hash' };
  const ExpressionAttributeValues: { [name: string]: any } = {
    ':hash': { S: hash },
  };

  if (range) {
    conditions.push('begins_with(#range, :range)');
    ExpressionAttributeNames['#range'] = 'range';
    ExpressionAttributeValues[':range'] = { S: range };
  }

  const params = {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    KeyConditionExpression: conditions.join(' and '),
    TableName,
  };

  return dynamodb.query(params).promise();
};

export const queryRangeHash = async (
  TableName: string,
  range: string,
  hash?: string,
): Promise<DynamoDB.QueryOutput> => {
  const IndexName = 'RangeHashIndex';
  const conditions = ['#range = :range'];
  const ExpressionAttributeNames: { [name: string]: any } = {
    '#range': 'range',
  };
  const ExpressionAttributeValues: { [name: string]: any } = {
    ':range': { S: range },
  };

  if (hash) {
    conditions.push('begins_with(#hash, :hash)');
    ExpressionAttributeNames['#hash'] = 'hash';
    ExpressionAttributeValues[':hash'] = { S: hash };
  }

  const params = {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    IndexName,
    KeyConditionExpression: conditions.join(' and '),
    TableName,
  };

  return dynamodb.query(params).promise();
};

export const queryTypeScope = async (
  TableName: string,
  type: string,
  scope?: string,
): Promise<DynamoDB.QueryOutput> => {
  const IndexName = 'TypeScopeIndex';
  const conditions = ['#type = :type'];
  const ExpressionAttributeNames: { [name: string]: any } = { '#type': 'type' };
  const ExpressionAttributeValues: { [name: string]: any } = {
    ':type': { S: type },
  };

  if (scope) {
    conditions.push('begins_with(#scope, :scope)');
    ExpressionAttributeNames['#scope'] = 'scope';
    ExpressionAttributeValues[':scope'] = { S: scope };
  }

  const params: any = {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    IndexName,
    KeyConditionExpression: conditions.join(' and '),
    TableName,
  };

  return dynamodb.query(params).promise();
};

export const touchItem = async (
  TableName: string,
  hash: string,
  range: string,
): Promise<DynamoDB.UpdateItemOutput> => {
  const params: { [key: string]: any } = {
    ConditionExpression:
      'attribute_not_exists(updatedAt) OR :updatedAt > #updatedAt',
    ExpressionAttributeNames: {
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':updatedAt': { S: new Date().toISOString() },
    },
    Key: {
      hash: { S: hash },
      range: { S: range },
    },
    ReturnValues: 'ALL_NEW',
    TableName,
    UpdateExpression: 'SET #updatedAt = :updatedAt',
  };

  try {
    return await dynamodb
      .updateItem(params as DynamoDB.UpdateItemInput)
      .promise();
  } catch (error) {
    throw new Error(error);
  }
};

export const unmarshall = (
  data: DynamoDB.AttributeMap,
  options?: DynamoDB.DocumentClient.ConverterOptions,
): { [key: string]: any } => {
  return DynamoDB.Converter.unmarshall(data, options);
};

export const updateItem = async (TableName: string, item: IModel, attrs: IHash ): Promise<DynamoDB.UpdateItemOutput> => {
  // Should we update, lets make sure to set the update datetime
  const ExpressionAttributeNames: { [key: string]: any } = {
    '#updatedAt': 'updatedAt',
  };
  const ExpressionAttributeValues: { [key: string]: any } = {
    ':updatedAt': { S: new Date().toISOString() },
  };
  const update = ['SET #updatedAt = :updatedAt'];

  Object.entries(attrs).forEach(([key, value]) => {
    ExpressionAttributeNames[`#${key}`] = key;
    update.push(`#${key} = :${key}`);

    if (Array.isArray(value)) {
      ExpressionAttributeValues[`:${key}`] = { L: value.map(v => marshall(v)) };
    } else {
      ExpressionAttributeValues[`:${key}`] = marshall(value as IHash | boolean | number | string);
    }
  });

  const params: DynamoDB.UpdateItemInput = {
    ConditionExpression:
      'attribute_not_exists(updatedAt) OR :updatedAt > #updatedAt',
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    Key: { hash: { S: item.hash }, range: { S: item.range } },
    ReturnValues: 'ALL_NEW',
    TableName,
    UpdateExpression: update.join(', '),
  };
  
  return await dynamodb.updateItem(params).promise();
};
