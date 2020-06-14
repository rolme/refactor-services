import { ItemType } from 'types';
import { DynamoDB } from 'aws-sdk';
import { isURL } from 'validator';
import { v4 as uuidv4 } from 'uuid';

const counter = async () => {
  const docClient = new DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION || 'us-west-2',
  });

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
      TableName: process.env.TABLE_ATOMICVARS as string,
      UpdateExpression: 'SET #v = if_not_exists(#v, :s) + :a',
    })
    .promise();

  // counter should return value between 0000-9999
  const value = p.Attributes ? p.Attributes.currentValue % 10000 : 1;
  return value.toString().padStart(4, '0');
};

export async function getId(type: ItemType) {
  const timestamp = new Date().getTime().toString();
  const id = await counter();
  return `${type}-${timestamp}-gql-${id}`;
}

// Generate a unique UUID for a given namespace
export const getUUID = (): string => {
  return uuidv4();
};

// format ISOString 2020-03-09T09:18:15.130Z to 2020-03-09_09-16-09
export const formatTimestamp = (timestamp: string): string => {
  const datetime = timestamp.split('.')[0];
  return datetime.replace(/T/, '_').replace(/:/g, '-');
};

// format ISOString 2020-03-09T09:18:15.130Z to 2020-03-09_09-16-09
export const formatDatetime = (dateime: string): string => {
  const datetimeWithoutTimezone = dateime.split('.')[0];
  return datetimeWithoutTimezone.replace(/T/, '_').replace(/:/g, '-');
};

// convert a datetime string into ISO format
export const convertToISOString = (datetime: string): string => {
  let isoDatetime = datetime;
  try {
    const date = new Date(datetime);
    isoDatetime = date.toISOString();
  } catch (e) {
    throw new Error(`Unable to convert [${datetime}] into ISO format`);
  }
  return isoDatetime;
};

// convert a datetime string into timestamp
export const convertToTimestamp = (datetime: string): number => {
  let timestamp = 0;
  try {
    const date = new Date(datetime);
    timestamp = Math.floor(date.getTime());
  } catch (e) {
    throw new Error(`Unable to convert [${datetime}] to UNIX timestamp`);
  }
  return timestamp;
};

// Remove any empty attributes within an object inplace
// params obj: object in which to remove empty attributes
// params shallow (true): only check initial attributes (not nested)
export const removeEmptyAttributes = (
  obj: { [key: string]: any },
  shallow = true,
) => {
  if (shallow) {
    return Object.keys(obj).forEach(
      (key) => obj[key] == null && delete obj[key],
    );
  }

  const removeEmpty = (obj: { [key: string]: any }) => {
    Object.keys(obj).forEach((key) => {
      // recurse
      if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
      else if (obj[key] == null) delete obj[key]; // delete
    });
  };

  return removeEmpty(obj);
};

// return timeout as a promise
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const validateId = (id: string, type: ItemType) => {
  if (!id) {
    throw new Error(`ID was not provided for item type ${type}`);
  }

  if (!id.startsWith(`${type}-`)) {
    throw new Error(`${id} is not a valid id for item type ${type}`);
  }
};

export const validateUrl = (url: string) => {
  if (!url) return;

  const isValidUrl = isURL(url, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    allow_trailing_dot: true,
    // eslint-disable-next-line @typescript-eslint/camelcase
    allow_underscores: true,
    protocols: ['http', 'https'],
  });

  if (!isValidUrl) {
    throw new Error(`INVALID_ARGUMENT:Invalid url.`);
  }
};
