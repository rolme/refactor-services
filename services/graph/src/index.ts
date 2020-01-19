import * as dynamoose from 'dynamoose';

import * as habit from './habit';
import * as task from './task';
import { Event, Context } from './types';
import * as user from './user';

interface IResolvers {
  [key: string]: (event: any, context: any) => any;
}

const resolvers: IResolvers = {
  createHabit: habit.create,
  createTask: task.create,
  deleteHabit: habit.destroy,
  deleteTask: task.destroy,
  deleteUser: user.destroy,
  getHabit: habit.find,
  getHabits: habit.all,
  getTask: task.find,
  getTasks: task.all,
  getUser: user.find,
  getUsers: user.all,
  updateHabit: habit.update,
  updateTask: task.update,
  updateUser: user.update
};

dynamoose.setDefaults({
  create: false,
  update: false,
});

export default function(event: Event, context: Context) {
  const resolver = resolvers[event.field];

  if (!resolver) {
    throw new Error(`Unknown field, unable to resolve ${event.field}`);
  }

  return resolver(event, context);
}
