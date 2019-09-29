import { v4 } from 'uuid';
import { createUser, ITestUser, loginUser } from './lib/auth';
import { gql } from './lib/query';

jest.setTimeout(20000);

export const user: ITestUser = {
  email: `qa-test+${v4()}@refactordaily.com`,
  password: v4(),
};

beforeAll(async () => {
  user.id = await createUser(user);
  user.token = await loginUser(user);
});

afterAll(async () => {
  // Delete User and all associated data
  await graphQuery('mutation { deleteUser { id email } }');
});

export async function graphQuery(
  query: string,
  variables?: object,
  apiKey?: boolean,
) {
  return gql(user, query, variables, apiKey);
}
