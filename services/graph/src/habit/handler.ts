import * as uuid from 'uuid';
import Habit from './model';
import {
  IHabit,
  IHabitAllParams,
  IHabitCreateParams,
  IHabitDestroyParams,
  IHabitFindParams,
  IHabitUpdateParams
} from './types';


function clean(obj: { [key: string]: any }) {
  const newObj: { [key: string]: any } = {};

  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === "object") {
      newObj[key] = clean(obj[key]);
    } else if (obj[key] != null) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

export async function all(params: IHabitAllParams) {
  let habits: IHabit[];

  if (params.userId) {
    habits = await Habit.query('hash')
      .eq(params.userId)
      .where('range')
      .beginsWith('HABIT-')
      .exec();
  } else {
    habits = await Habit.query('type')
      .eq('HABIT')
      .using('TypeScopeIndex')
      .exec();
  }

  if (!habits) {
    throw new Error('Could not find habits');
  }

  return habits;
}

export async function create(params: IHabitCreateParams) {
  const id = (params.id) ? params.id : `HABIT-${uuid.v4()}`;

  const habit = new Habit({
    ...clean(params) as IHabit,
    hash: params.userId,
    id,
    range: id,
    scope: id,
    type: 'HABIT',
    userId: params.userId,
  });

  await habit.save();
  return habit;
}

export async function destroy(params: IHabitDestroyParams) {
  const habit = await find(params);
  Habit.delete({ hash: habit.hash, range: habit.range });

  return habit;
}

export async function find(params: IHabitFindParams) {
  const habit = await Habit.queryOne('range')
    .eq(params.id)
    .where('hash')
    .beginsWith('USER-')
    .using('RangeHashIndex')
    .exec();

  if (!habit) {
    throw new Error('Habit could not be found');
  }

  if (params.userId && habit.userId !== params.userId) {
    throw new Error('Habit does not belong to user.')
  }

  return habit;
}

export async function update(params: IHabitUpdateParams) {
  const habit = await find(params);
  const {
    category,
    description,
    enableWeekends,
    place,
    time,
    triggger,
    why
  } = params;

  const habitChanges: {[ key: string]: any } = {}
  if (category) {
    habitChanges['category'] = category;
  }

  if (description) {
    habitChanges['description'] = description;
  }

  if (enableWeekends) {
    habitChanges['enableWeekends'] = enableWeekends;
  }

  if (place) {
    habitChanges['place'] = place;
  }

  if (time) {
    habitChanges['time'] = time;
  }

  if (triggger) {
    habitChanges['triggger'] = triggger;
  }

  if (why) {
    habitChanges['why'] = why;
  }

  if (Object.keys(habitChanges).length === 0) {
    return habit;
  }

  const updatedHabit = await Habit.update({ hash: habit.hash, range: habit.range }, habitChanges);
  return updatedHabit;
}
