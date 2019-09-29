import { graphQuery, user } from './helpers';

test('Returns user', async () => {
  const result = await graphQuery(
    '{ getUser { id email updatedAt createdAt } }',
  );

  expect(result.data.getUser.id).toEqual(user.id);
  expect(result.data.getUser.email).toEqual(user.email);
  expect(result.data.getUser.updatedAt).toEqual(result.data.getUser.createdAt);
});

test('Updates name', async () => {
  const name = 'New Name';
  const result = await graphQuery(
    'mutation UpdateUser($name:String!){ updateUser(name:$name) { name } }',
    { name },
  );
  expect(result.data).toHaveProperty('updateUser');
  expect(result.data.updateUser).toHaveProperty('name');
  expect(result.data.updateUser.name).toEqual(name);
});

test('Updates email', async () => {
  const newEmail = `qa-test+${Math.random()}@refactordaily.com`;
  const result = await graphQuery(
    'mutation UpdateUser($email:String){ updateUser(email:$email) { email } }',
    { email: newEmail },
  );
  expect(result.data).toHaveProperty('updateUser');
  expect(result.data.updateUser).toHaveProperty('email');
  expect(result.data.updateUser.email).toEqual(newEmail);
  user.email = newEmail;
});

test('Returns new email', async () => {
  const result = await graphQuery('{ getUser { email } }');
  expect(result.data).toHaveProperty('getUser');
  expect(result.data.getUser).toHaveProperty('email');
  expect(result.data.getUser.email).toEqual(user.email);
});
