import * as dynamoose from 'dynamoose';

import * as habit from './habit';
import * as types from './types';
import * as user from './user';

interface IResolvers {
  [key: string]: (event: any, context: any) => any;
}

const resolvers: IResolvers = {
  createHabit: habit.create,
  deleteHabit: habit.remove,
  deleteUser: user.remove,
  getHabit: habit.find,
  getHabits: habit.findAll,
  getHabitsForUser: habit.findAllForUser,
  getUser: user.find,
  getUserForHabit: user.findUser,
  getUsers: user.findAll,
  updateUser: user.update,
};

dynamoose.setDefaults({
  create: false,
  update: false,
});

export default function(event: types.Event, context: types.Context) {
  const resolver = resolvers[event.field];

  if (!resolver) {
    throw new Error(`Unknown field, unable to resolve ${event.field}`);
  }

  return resolver(event, context);
}
