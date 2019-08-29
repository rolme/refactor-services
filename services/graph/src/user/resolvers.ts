import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as types from '../types';
import User from './model';

const cognito = new CognitoIdentityServiceProvider();

export async function find(event: types.Event<{}>) {
  const username = `USER-${event.context.identity.sub}`;
  console.log('username', username);

  const user = await User.queryOne('id')
    .eq(username)
    .where('key')
    .eq(username)
    .exec();

  console.log('user', user);
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

  if (event.context.arguments.email) {
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
