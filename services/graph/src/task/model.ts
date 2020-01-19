import { model, Schema } from 'dynamoose';
import { schema } from '../types';
import { ITask } from './types';

const TaskSchema = new Schema(
  {
    ...schema,
    completed: {
      required: true,
      type: Boolean,
    },
    completionDate: {
      required: true,
      type: String,
    },
    difficulty: {
      type: Number,
    },
    habitId: {
      required: true,
      type: String,
    },
    rating: {
      type: Number,
    },
    version: {
      type: String,
    },
    },
  {
    timestamps: true,
  },
);

export default model<ITask, { hash: string; range: string }>(
  'TASK',
  TaskSchema,
  {
    create: true,
    tableName: process.env.TABLE_REFACTOR || 'Refactor',
    update: true,
  },
);
