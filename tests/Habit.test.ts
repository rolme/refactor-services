import * as helper from './helpers';
import { Category } from '../services/graph/src/types';

test('Create a habit', async () => {
  const category = Category.FOCUS;
  const description = 'Automated Test Habit #1';
  const habit = await helper.createHabitMutation(category, description);

  expect(habit.category).toEqual(category);
  expect(habit.description).toEqual(description);
});

test('Get a habit with user', async () => {
  const habit = await helper.getHabitQuery();
  const result = await helper.graphQuery(
    `{
      getHabit(id:"${habit.id}") {
        category
        description
        id
        user {
          id
        }
      }
    }`,
  );

  expect(result.data.getHabit.id).toEqual(habit.id);
  expect(result.data.getHabit.user.id).toEqual(helper.user.id);
});

test('Delete a habit', async () => {
  const habit = await helper.getHabitQuery();
  const result = await helper.graphQuery(
    `mutation DeleteHabit($id:ID!) {
      deleteHabit(id:$id) { id description }
    }`,
    { id: habit.id },
  );

  expect(result.data.deleteHabit.id).toEqual(habit.id);
});

test('Update a habit', async () => {
  const habit = await helper.getHabitQuery();
  const description = 'new habit description';

  const result = await helper.graphQuery(
    `mutation UpdateHabit($id:ID!, $description:String) {
      updateHabit(id:$id, description:$description) {
        id description
      }
    }`,
    { id: habit.id, description },
  );

  expect(result.data.updateHabit.id).toEqual(habit.id);
  expect(result.data.updateHabit.description).toEqual(description);
});
