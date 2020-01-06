import { CognitoIdentityServiceProvider, Lambda } from 'aws-sdk';
import * as validator from 'validator';
import { S3File } from '../../lib/S3File';
import Habit from '../habit/model';
import {
  Event,
  S3ObjectInput,
  UpdateUserMutationVariables
} from '../types';
import User from './model';

const avatarFileTypes = ['image/jpeg', 'image/jpg'];
const lambda = new Lambda();

async function get(id: string) {
  if (!id.startsWith('USER-')) {
    return;
  }

  const user = User.get({ hash: id, range: id });
  return user;
}

export async function find(event: Event<{}, { userId: string }>) {
  let username = `USER-${event.context.identity.sub}`;
  if (event.context.source && event.context.source.userId) {
    username = event.context.source.userId;
  }

  const user = User.get({ hash: username, range: username });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function update(
  event: Event<UpdateUserMutationVariables>,
) {
  let username = `USER-${event.context.identity.sub}`;
  const user = await get(username);
  if (!user) {
    throw new Error('User not found!');
  }

  const attr: CognitoIdentityServiceProvider.AttributeType[] = [];
  const updateUser: { [key: string]: any } = {};

  if (event.context.arguments.avatar) {
    await validImageFile(event.context.arguments.avatar);
    updateUser.avatar = event.context.arguments.avatar;
  }

  if (event.context.arguments.email) {
    if (!validator.isEmail(event.context.arguments.email)) {
      throw new Error('Email is invalid');
    }

    updateUser.email = event.context.arguments.email.toLowerCase();

    attr.push({ Name: 'email', Value: updateUser.email });
    attr.push({
      Name: 'custom:rawEmail',
      Value: event.context.arguments.email,
    });
  }

  if (event.context.arguments.name) {
    updateUser.name = event.context.arguments.name;
  }

  if (event.context.arguments.profile) {
    updateUser.profile = event.context.arguments.profile;
  }

  if (event.context.arguments.avatar) {
    await uploadImageFile(
      event.context.arguments.avatar.bucket,
      event.context.request.headers.authorization,
      'avatar',
      event.context.arguments.avatar,
    );
  }

  await updateCognitoUser(event.context.identity.sub, attr);

  if (Object.keys(updateUser).length) {
    return await User.update({ hash: user.hash, range: user.range }, updateUser);
  }

  return user;
}

export async function all() {
  const users = User.query('type')
    .eq('USER')
    .using('TypeScopeIndex')
    .exec();
  return users;
}

export async function destroy(event: Event<{}>) {
  const Username = event.context.identity.sub;
  const UserPoolId = process.env.USER_POOL_ID!;
  const cognito = new CognitoIdentityServiceProvider();
  const id = `USER-${Username}`;
  const user = await User.get({ hash: id, range: id });

  if (!user) {
    console.log('User not found.');
    throw new Error(`Could not find user: USER-${Username}`);
  }

  await cognito.adminUserGlobalSignOut({ UserPoolId, Username }).promise();
  await cognito.adminDeleteUser({ UserPoolId, Username }).promise();

  await destroyAssociatedItems(id);
  await User.delete({ hash: user.hash, range: user.range });
  return user;
}

async function destroyAssociatedItems(userId: string) {
  // HABITS
  const habits = await Habit.query('hash')
    .eq(userId)
    .where('range')
    .beginsWith('HABIT-')
    .exec();

  for (const habit of habits) {
    await Habit.delete({ hash: habit.hash, range: habit.range });
  }
}

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

async function validImageFile(file: S3ObjectInput) {
  const s3file = new S3File(file);

  // Check if file has been uploaded
  if (!(await s3file.exists())) {
    throw new Error('File not found');
  }

  if (!avatarFileTypes.includes(file.mimeType)) {
    throw new Error('Invalid file type');
  }
}

// NOTE: Updating Cognito custom attributes will not initially be seen by end-user until 1 hour or
//       when they login again. The attributes are saved in the ID Token.
async function updateCognitoUser(
  Username: string,
  UserAttributes: CognitoIdentityServiceProvider.AttributeType[],
) {
  const cognito = new CognitoIdentityServiceProvider();
  const UserPoolId = process.env.USER_POOL_ID!;

  await cognito
    .adminUpdateUserAttributes({ UserAttributes, UserPoolId, Username })
    .promise();
}
