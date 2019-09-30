import { IModel } from '../types';

export interface IHabit extends IModel {
  category?: string;
  description: string;
  enableWeekends?: boolean;
  place?: string;
  time?: string;
  triggger?: string;
  userId: string;
  why?: string;
}
