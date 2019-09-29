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

export async function getHabit() {
  const habits = await graphQuery('{ getHabits { id description } }');

  const description = 'Automated test habit';
  if (habits.data.getHabits.length > 0) {
    const testHabit = habits.data.getHabits.filter(
      (h: any) => h.description === description,
    );
    if (testHabit.length > 0) {
      return testHabit[0];
    }
  }

  const result = await graphQuery(
    'mutation CreateHabit($description:String!) { createHabit(description:$description) { id description } }',
    { description },
  );

  return result.data.createHabit;
}
