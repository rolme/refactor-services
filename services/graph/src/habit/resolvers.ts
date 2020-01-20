import * as uuid from 'uuid';
import {
  CreateHabitMutationVariables,
  Event,
  DeleteHabitMutationVariables,
  GetHabitQueryVariables,
  GetHabitsQueryVariables,
  UpdateHabitMutationVariables
} from '../types';
import * as handler from './handler';
import {
  IHabit,
  IHabitCreateParams,
  IHabitUpdateParams
} from './types';

export async function all(event: Event<GetHabitsQueryVariables, { userId: string }>) {
  const role = event.context.identity.claims['custom:role'];
  let habits: IHabit[];

  if (event.context.arguments.userId && role === 'admin') {
    const userId = event.context.arguments.userId;
    habits = await handler.all({ userId })
  } else if (role === 'admin') {
    habits = await handler.all({})
  } else {
    const userId = `USER-${event.context.identity.sub}`;
    habits = await handler.all({ userId })
  }

  if (!habits) {
    throw new Error('Could not find habits');
  }

  return habits;
}

export async function create(event: Event<CreateHabitMutationVariables>) {
  let userId = `USER-${event.context.identity.sub}`;
  let id = event.context.arguments.id;
  id = (id) ? id : `HABIT-${uuid.v4()}`;
  if (
    event.context.arguments.userId &&
    event.context.identity.claims['custom:role'] === 'admin'
  ) {
    userId = event.context.arguments.userId;
  }

  const params: IHabitCreateParams = {
    ...event.context.arguments,
    id,
    userId
  }

  const habit = await handler.create(params);
  return habit;
}

export async function destroy(event: Event<DeleteHabitMutationVariables>) {
  const habit = await handler.destroy({ id: event.context.arguments.id });
  return habit;
}

export async function find(event: Event<GetHabitQueryVariables, { habitId: string }>) {
  const userId = `USER-${event.context.identity.sub}`;
  let id = event.context.arguments.id;
  id = (id) ? id : event.context.source.habitId;
  let habit: IHabit;

  if (event.context.identity.claims['custom:role'] === 'admin') {
    habit = await handler.find({ id })
  } else {
    habit = await handler.find({ id, userId })
  }

  if (!habit) {
    throw new Error('Habit could not be found');
  }

  return habit;
}

export async function update(event: Event<UpdateHabitMutationVariables>) {
  let userId = `USER-${event.context.identity.sub}`;
  let id = event.context.arguments.id;
  id = (id) ? id : `HABIT-${uuid.v4()}`;

  if (
    event.context.identity.claims['custom:role'] === 'admin' &&
    event.context.arguments.userId
  ) {
    userId = event.context.arguments.userId;
  }

  const params: IHabitUpdateParams = {
    ...event.context.arguments,
    id,
    userId
  }
  if (!params.userId) { delete params.userId }

  const habit = await handler.update(params);
  return habit;
}
  
  