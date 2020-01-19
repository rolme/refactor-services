import * as uuid from 'uuid';
import Task from './model';
import {
  ITask,
  ITaskAllParams,
  ITaskCreateParams,
  ITaskDestroyParams,
  ITaskFindParams,
  ITaskUpdateParams
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

export async function all(params: ITaskAllParams) {
  let tasks: ITask[];

  if (!params.habitId || !params.habitId.startsWith('HABIT-')) {
    throw new Error(`INVALID_ID:Invalid id.`)
  }

  tasks = await Task.query('range')
    .eq(params.habitId)
    .where('hash')
    .beginsWith('TASK-')
    .using('RangeHashIndex')
    .exec();

  return tasks;
}

export async function create(params: ITaskCreateParams) {
  const id = (params.id) ? params.id : `TASK-${uuid.v4()}`;

  const task = new Task({
    ...clean(params) as ITask,
    completed: params.completed,
    completionDate: params.completionDate,
    difficulty: params.difficulty,
    habitId: params.habitId,
    hash: id,
    id,
    range: params.habitId,
    rating: params.rating,
    scope: params.habitId,
    type: 'TASK',
    // TODO: JSON stringify habit
    // version: params.version
  });

  await task.save();
  return task;
}

export async function destroy(params: ITaskDestroyParams) {
  const task = await find(params);
  Task.delete({ hash: task.hash, range: task.range });

  return task;
}

export async function find(params: ITaskFindParams) {
  const task = await Task.queryOne('hash')
    .eq(params.id)
    .exec();

  if (!task) {
    throw new Error('Task could not be found');
  }

  return task;
}

export async function update(params: ITaskUpdateParams) {
  const task = await find(params);
  const {
    completed,
    completionDate,
    difficulty,
    rating
  } = params;

  const attr: {[ key: string]: any } = {}
  if (completed !== undefined && completed !== null) {
    attr['completed'] = completed;
  }

  if (completionDate) {
    attr['completionDate'] = completionDate;
  }

  if (difficulty) {
    attr['difficulty'] = difficulty;
  }

  if (rating) {
    attr['rating'] = rating;
  }

  if (Object.keys(attr).length === 0) {
    return task;
  }

  const updatedTask = await Task.update({ hash: task.hash, range: task.range }, attr);
  return updatedTask;
}
