import { S3 } from 'aws-sdk';

const s3 = new S3();

// copy object from one s3 location to another s3 location
export const copyObject = async (
  CopySource: string,
  Bucket: string,
  Key: string,
): Promise<S3.CopyObjectOutput> => {
  const params = {
    Bucket,
    CopySource,
    Key,
  };

  try {
    return await s3.copyObject(params).promise();
  } catch (error) {
    throw new Error(error);
  }
};

export const getObject = async (
  Bucket: string,
  Key: string,
): Promise<S3.GetObjectOutput> => {
  const params = {
    Bucket,
    Key,
  };

  try {
    return await s3.getObject(params).promise();
  } catch (error) {
    throw new Error(error);
  }
};

// get head information for an object in S3
export const headObject = async (
  Bucket: string,
  Key: string,
): Promise<S3.HeadObjectOutput> => {
  const params = {
    Bucket,
    Key,
  };

  try {
    return await s3.headObject(params).promise();
  } catch (error) {
    throw new Error(error);
  }
};

// list files in a S3 location
export const listObjects = async (
  Bucket: string,
  Prefix: string,
): Promise<S3.ListObjectsV2Output> => {
  const params = {
    Bucket,
    Prefix,
  };

  try {
    return await s3.listObjectsV2(params).promise();
  } catch (error) {
    throw new Error(error);
  }
};

// save string as file to s3
export const putObject = async (
  Bucket: string,
  Key: string,
  Body: string,
): Promise<S3.PutObjectOutput> => {
  const params = {
    Body,
    Bucket,
    Key,
  };

  try {
    return await s3.putObject(params).promise();
  } catch (error) {
    throw new Error(error);
  }
};
