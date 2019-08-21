import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as types from '../types';
import User from './model';

const cognito = new CognitoIdentityServiceProvider();

export async function find(event: types.Event<{}>) {
  return getUser(event.context.identity.sub);
}

export async function getUser(userName: string) {
  const result = await User.get({
    id: userName,
  });

  if (!result) {
    throw new Error('User not found');
  }

  const user: { [key: string]: any } = result;

  if (user.expiresAt) {
    user.expiresAt = new Date(parseInt(user.expiresAt, 10));
  }
  user.createdAt = new Date(result.createdAt);
  user.updatedAt = new Date(result.updatedAt);

  user.state = 'FREE_TRIAL';
  if (user.expiresAt && user.expiresAt < new Date()) {
    user.state = 'EXPIRED';
  } else {
    if (user.expiresAt) {
      user.state = 'EXPIRING_SUBSCRIBER';
    } else {
      user.state = 'ACTIVE_SUBSCRIBER';
    }
  }
  return user;
}

export async function update(
  event: types.Event<types.UpdateUserMutationVariables>,
) {
  const updateUser = {} as any;

  if (event.context.arguments.email) {
    updateUser['email'] = event.context.arguments.email;

    const UserAttributes = [
      {
        Name: 'email',
        Value: event.context.arguments.email,
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
        Username: event.context.identity.sub,
      })
      .promise();
  }

  if (event.context.arguments.name) {
    updateUser['name'] = event.context.arguments.name;
  }

  if (event.context.arguments.profile) {
    updateUser['profile'] = event.context.arguments.profile;
  }

  if (Object.keys(updateUser).length) {
    await User.update(
      {
        id: event.context.identity.sub,
      },
      updateUser,
    );
  }

  return getUser(event.context.identity.sub);
}

export async function remove(event: types.Event<{}>) {
  const user = await User.get({
    id: event.context.identity.sub,
  });

  if (!user) {
    return null;
  }

  const userAttr = await getUser(event.context.identity.sub);

  await cognito
    .adminUserGlobalSignOut({
      UserPoolId: process.env.USER_POOL_ID!,
      Username: event.context.identity.sub,
    })
    .promise();

  await cognito
    .adminDeleteUser({
      UserPoolId: process.env.USER_POOL_ID!,
      Username: event.context.identity.sub,
    })
    .promise();

  await user.delete();

  return userAttr;
}
