import * as helper from './helpers';

test('Create a task', async () => {
  const habit = await helper.getHabitQuery();
  const completed = true;
  const completionDate = new Date().toString();


  const result = await helper.graphQuery(
    `mutation CreateTask(
      $completed:Boolean!
      $completionDate:String!
      $habitId:ID!
    ) {
      createTask(
        completed:$completed
        completionDate:$completionDate
        habitId:$habitId
      ) {
        completed
        completionDate
        id
        habit {
          id
        }
      }
    }`,
    { completed, completionDate, habitId: habit.id }
  );
  expect(result.data.createTask.completed).toEqual(completed);
  expect(result.data.createTask.completionDate).toEqual(completionDate);
  expect(result.data.createTask.habit.id).toEqual(habit.id);
});

test('Delete a task', async () => {
  const task = await helper.getTaskQuery();
  const result = await helper.graphQuery(
    `mutation DeleteTask($id:ID!) {
      deleteTask(id:$id) { completed completionDate id }
    }`,
    { id: task.id },
  );

  expect(result.data.deleteTask.completed).toEqual(task.completed);
  expect(result.data.deleteTask.complettionDate).toEqual(task.complettionDate);
  expect(result.data.deleteTask.id).toEqual(task.id);
});

test('Update a task', async () => {
  const task = await helper.getTaskQuery();
  const completed = false;
  const difficulty = 2;
  const id = task.id;
  const rating = 5;

  const result = await helper.graphQuery(
    `mutation UpdateTask(
      $completed:Boolean!
      $difficulty:Int
      $id:ID!
      $rating:Int  
    ) {
      updateTask(
        completed:$completed
        difficulty:$difficulty
        id:$id
        rating:$rating
      ) {
        completed
        difficulty
        id
        rating
      }
    }`,
    { completed, difficulty, id, rating },
  );

  expect(result.data.updateTask.completed).toEqual(completed);
  expect(result.data.updateTask.difficulty).toEqual(difficulty);
  expect(result.data.updateTask.id).toEqual(task.id);
  expect(result.data.updateTask.rating).toEqual(rating);
});
