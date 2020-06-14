import { IModel } from 'types';

export interface IHabit extends IModel {
  category: string;
  description: string;
  enableWeekends?: boolean;
  place?: string;
  time?: string;
  triggger?: string;
  userId: string;
  why?: string;
}

export interface IHabitAllParams {
  userId?: string;
}

export interface IHabitCreateParams {
  category: string;
  description: string;
  enableWeekends?: boolean | null;
  id?: string;
  place?: string | null;
  time?: string | null;
  triggger?: string | null;
  userId: string;
  why?: string | null;
}

export interface IHabitDestroyParams {
  id: string;
  userId?: string;
}

export interface IHabitFindParams {
  id: string;
  userId?: string | null;
}

export interface IHabitUpdateParams {
  category?: string | null;
  description?: string | null;
  enableWeekends?: boolean | null;
  id: string;
  place?: string | null;
  time?: string | null;
  triggger?: string | null;
  userId?: string | null;
  why?: string | null;
}
