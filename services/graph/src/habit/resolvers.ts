import * as uuid from 'uuid';
import * as types from '../types';
import Habit from './model';
import { IHabit } from './types';

export async function create(
  event: types.Event<{
    category: string;
    description: string;
    enableWeekends: boolean;
    place: string;
    time: string;
    trigger: string;
    userId: string;
    why: string;
  }>,
) {
  const id = `HABIT-${uuid.v4()}`;
  let userId = `USER-${event.context.identity.sub}`;
  if (
    event.context.arguments.userId &&
    event.context.identity.claims['custom:role'] === 'admin'
  ) {
    userId = event.context.arguments.userId;
  }

  const habit = new Habit({
    ...event.context.arguments,
    hash: userId,
    id,
    range: id,
    scope: id,
    type: 'HABIT',
    userId,
  });

  await habit.save();
  return habit;
}

export async function find(
  event: types.Event<{
    id: string;
    userId?: string;
  }>,
) {
  const userId = `USER-${event.context.identity.sub}`;
  const habitId = event.context.arguments.id;
  let habit: IHabit;

  if (event.context.identity.claims['custom:role'] === 'admin') {
    habit = await Habit.queryOne('type')
      .eq('HABIT')
      .where('scope')
      .eq(habitId)
      .using('TypeScopeIndex')
      .exec();
  } else {
    habit = await Habit.queryOne('hash')
      .eq(userId)
      .where('range')
      .eq(habitId)
      .exec();
  }

  if (!habit) {
    throw new Error('Habit could not be found');
  }

  return habit;
}

export async function findAll(
  event: types.Event<{
    userId?: string;
  }>,
) {
  const role = event.context.identity.claims['custom:role'];
  let userId = `USER-${event.context.identity.sub}`;
  let habits: IHabit[];

  if (event.context.arguments.userId && role === 'admin') {
    userId = event.context.arguments.userId;
    habits = await Habit.query('hash')
      .eq(userId)
      .where('range')
      .beginsWith('HABIT-')
      .exec();
  } else if (role === 'admin') {
    habits = await Habit.query('type')
      .eq('HABIT')
      .using('TypeScopeIndex')
      .exec();
  } else {
    habits = await Habit.query('hash')
      .eq(userId)
      .where('range')
      .beginsWith('HABIT-')
      .exec();
  }

  if (!habits) {
    throw new Error('Could not find habits');
  }

  return habits;
}

export async function findAllForUser(
  event: types.Event<{}, {id: string}>,
) {
  const userId = event.context.source.id;
  let habits: IHabit[];

  habits = await Habit.query('hash')
    .eq(userId)
    .where('range')
    .beginsWith('HABIT-')
    .exec();

  if (!habits) {
    throw new Error('Could not find habits');
  }

  return habits;
}

export async function remove(
  event: types.Event<{
    id: string;
  }>,
) {
  const habit = await find(event);
  Habit.delete({ hash: habit.hash, range: habit.range });

  return habit;
}
