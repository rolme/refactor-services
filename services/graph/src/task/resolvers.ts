import {
  CreateTaskMutationVariables,
  Event,
  DeleteTaskMutationVariables,
  GetTaskQueryVariables,
  GetTasksQueryVariables,
  UpdateTaskMutationVariables
} from '../types';
import * as handler from './handler';
import {
  ITask,
  ITaskCreateParams,
  ITaskUpdateParams
} from './types';

export async function all(event: Event<GetTasksQueryVariables, { id: string }>) {
  let tasks: ITask[];

  const id = (event.context.source) ? event.context.source.id : undefined;
  const habitId = event.context.arguments.habitId;
  if (!habitId && !id) {
    throw new Error('MISSING_ID:Could not find tasks');
  }

  if (habitId) {
    tasks = await handler.all({ habitId })
    return tasks;
  }
  
  tasks = await handler.all({ habitId: id })
  return tasks;
}

// TODO: Work on create and the rest
export async function create(event: Event<CreateTaskMutationVariables>) {
  let id = event.context.arguments.id || undefined;

  const params: ITaskCreateParams = {
    ...event.context.arguments,
    id,
  }

  const task = await handler.create(params);
  return task;
}

export async function destroy(event: Event<DeleteTaskMutationVariables>) {
  const task = await handler.destroy({ id: event.context.arguments.id });
  return task;
}

export async function find(event: Event<GetTaskQueryVariables, { taskId: string }>) {
  const id = event.context.arguments.id;
  const task = await handler.find({ id })

  if (!task) {
    throw new Error('task could not be found');
  }

  return task;
}

export async function update(event: Event<UpdateTaskMutationVariables>) {

  const params: ITaskUpdateParams = {
    ...event.context.arguments,
  }

  const task = await handler.update(params);
  return task;
}
