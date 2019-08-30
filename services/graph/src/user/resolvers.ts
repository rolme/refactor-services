import { CognitoIdentityServiceProvider, Lambda } from 'aws-sdk';
import * as validator from 'validator';
import { S3File } from '../../lib/S3File';

import * as types from '../types';
import User from './model';

const avatarFileTypes = ['image/jpeg', 'image/jpg'];
const cognito = new CognitoIdentityServiceProvider();
const lambda = new Lambda();

async function uploadImageFile(
  bucket: string,
  authorization: string | undefined,
  key: string,
  image: any,
) {
  if (bucket === process.env.UPLOAD_BUCKET) {
    const args = {
      authorization,
      [key]: image,
    };
    await lambda
      .invoke({
        FunctionName: process.env.LAMBDA_THUMBNAILS!,
        InvocationType: 'Event',
        Payload: JSON.stringify(args),
      })
      .promise();
  }
}

async function validImageFile(file: types.S3ObjectInput) {
  const s3file = new S3File(file);

  // Check if file has been uploaded
  if (!(await s3file.exists())) {
    throw new Error('File not found');
  }

  if (!avatarFileTypes.includes(file.mimeType)) {
    throw new Error('Invalid file type');
  }
}

export async function find(event: types.Event<{}>) {
  const username = `USER-${event.context.identity.sub}`;

  const user = await User.queryOne('id')
    .eq(username)
    .where('key')
    .eq(username)
    .exec();

  if (!user) {
    throw new Error('User not found');
  }

  // TODO: Check status & expiration, not needed now.
  return user;
}

export async function update(
  event: types.Event<types.UpdateUserMutationVariables>,
) {
  const updateUser: { [key: string]: any } = {};

  if (event.context.arguments.avatar) {
    await validImageFile(event.context.arguments.avatar);
    updateUser.avatar = event.context.arguments.avatar;
  }

  if (event.context.arguments.email) {
    if (!validator.isEmail(event.context.arguments.email)) {
      throw new Error('Email is invalid');
    }

    updateUser.email = event.context.arguments.email;
    await updateCognitoUser(
      event.context.arguments.email,
      event.context.identity.sub,
    );
  }

  if (event.context.arguments.name) {
    updateUser.name = event.context.arguments.name;
  }

  if (event.context.arguments.profile) {
    updateUser.profile = event.context.arguments.profile;
  }

  if (Object.keys(updateUser).length) {
    await User.update(
      {
        id: `USER-${event.context.identity.sub}`,
        key: `USER-${event.context.identity.sub}`,
      },
      updateUser,
    );
  }

  if (event.context.arguments.avatar) {
    await uploadImageFile(
      event.context.arguments.avatar.bucket,
      event.context.request.headers.authorization,
      'avatar',
      event.context.arguments.avatar,
    );
  }

  return find(event);
}

export async function findAll() {
  const users = await User.query('entity')
    .eq('USER')
    .using('EntityIdIndex')
    .exec();

  // TODO: Check status & expiration, not needed now.
  return users;
}

async function updateCognitoUser(email: string, username: string) {
  const UserAttributes = [
    {
      Name: 'email',
      Value: email.toLowerCase(),
    },
    {
      Name: 'email_verified',
      Value: 'true',
    },
  ];

  await cognito
    .adminUpdateUserAttributes({
      UserAttributes,
      UserPoolId: process.env.USER_POOL_ID!,
      Username: username,
    })
    .promise();
}

export async function remove(event: types.Event<{}>) {
  const user = await find(event);
  const Username = event.context.identity.sub;
  const UserPoolId = process.env.USER_POOL_ID!;

  if (!user) {
    return null;
  }

  await cognito
    .adminUserGlobalSignOut({
      UserPoolId,
      Username,
    })
    .promise();

  await cognito
    .adminDeleteUser({
      UserPoolId,
      Username,
    })
    .promise();

  await user.delete((err) => {
    if (err) {
      throw new Error(`Unable to delete ${Username}`);
    }
  });

  return user;
}
