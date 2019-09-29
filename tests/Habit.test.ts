import { getHabit, graphQuery } from './helpers';

test('Create a habit', async () => {
  const description = 'Automated Test Habit #1';
  const result = await graphQuery(
    'mutation CreateHabit($description:String!) { createHabit(description:$description) { id description } }',
    { description },
  );

  expect(result.data.createHabit.description).toEqual(description);
});

test('Get a habit', async () => {
  const habit = await getHabit();
  const result = await graphQuery(
    `{ getHabit(id:"${habit.id}") { id description } }`,
  );

  expect(result.data.getHabit.id).toEqual(habit.id);
});

test('Delete a habit', async () => {
  const habit = await getHabit();
  const result = await graphQuery(
    'mutation DeleteHabit($id:ID!) { deleteHabit(id:$id) { id description } }',
    { id: habit.id },
  );

  expect(result.data.deleteHabit.id).toEqual(habit.id);
});
