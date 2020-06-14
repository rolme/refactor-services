import {
  IHabit,
  IHabitAllParams,
  IHabitCreateParams,
  IHabitDestroyParams,
  IHabitFindParams,
  IHabitUpdateParams,
  ItemType,
} from 'types';
import { getId, removeEmptyAttributes, validateId } from 'core/utils';
import { query, queryTypeScope } from 'core/dynamodb';

const DEFAULT_TABLE = process.env.TABLE_REFACTOR as string;

export async function all(params: IHabitAllParams) {
  validateId(params.id, ItemType.USER);
  let habits: IHabit[];
  let results: 
  if (params.userId) {
    let results = await query(DEFAULT_TABLE, params.userId, ItemType.HABIT);
  } else {
    const results = await queryTypeScope(DEFAULT_TABLE, ItemType.HABIT);
  }

  if (!habits) {
    throw new Error('Could not find habits');
  }

  return habits;
}

export async function create(params: IHabitCreateParams) {
  const id = (params.id) ? params.id : await getId(ItemType.HABIT);
  console.log(`The value of id is ${id}`)
  const habit = new Habit({
    ...removeEmptyAttributes(params) as IHabit,
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
