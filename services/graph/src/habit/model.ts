import { model, Schema } from 'dynamoose';
import { schema } from '../types';
import { IHabit } from './types';

const HabitSchema = new Schema(
  {
    ...schema,
    category: {
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    enableWeekends: {
      default: true,
      required: true,
      type: Boolean,
    },
    place: {
      type: String,
    },
    time: {
      type: String,
    },
    trigger: {
      type: String,
    },
    why: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IHabit, { hash: string; range: string }>(
  'HABIT',
  HabitSchema,
  {
    create: true,
    tableName: process.env.TABLE_REFACTOR || 'Refactor',
    update: true,
  },
);
