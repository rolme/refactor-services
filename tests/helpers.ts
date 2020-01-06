import { v4 } from 'uuid';
import { Category } from '../services/graph/src/types';
import { IHabit } from '../services/graph/src/habit/types';
// import * as Habit from '../services/graph/src/habit/handler';
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

////////////////////////////////////////////////////////////////////////////////
// GRAPH METHODS
////////////////////////////////////////////////////////////////////////////////
export async function graphQuery(
  query: string,
  variables?: object,
  apiKey?: boolean,
) {
  return gql(user, query, variables, apiKey);
}

////////////////////////////////////////////////////////////////////////////////
// HELPER MODEL METHODS
////////////////////////////////////////////////////////////////////////////////
// export async function createHabit(
//   category: Category = Category.SLEEP,
//   description: string = 'Automated Test Habit'
// ) {
//   const habit = await Habit.create({
//     category,
//     description,
//     userId: user.id || 'USER-test'
//   });
//   return habit;
// }

export async function createHabitMutation(
  category: Category = Category.SLEEP,
  description: string = 'Automated Test Habit'
): Promise<IHabit> {
  const result = await graphQuery(
    `mutation CreateHabit($category:Category!, $description:String!) {
      createHabit(
        category:$category
        description:$description
      ) {
        category
        description
        id
      }
    }`,
    {
      category,
      description
    },
  );
  return result.data.createHabit;
}

// export async function getHabit() {
//   const habits = await Habit.all({});
//   if (habits.length > 0) { return habits[0] }

//   const habit = await createHabit();
//   return habit;
// }

export async function getHabitQuery() {
  const habits = await graphQuery(
    `{
      getHabits(userId:"${user.id}") {
        category
        description
        id
      }
    }`
  );

  if (habits.data.getHabits.length > 0) {
    return habits.data.getHabits[0];
  }

  const habit = await createHabitMutation();
  return habit;
}
