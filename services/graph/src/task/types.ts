import { IModel } from '../types';

export interface ITask extends IModel {
  completed: boolean;
  completionDate: string;
  createdAt: string;
  difficulty?: number | null;
  habitId: string;
  id: string;
  rating?: number | null;
  updatedAt: string;
  version?: string | null;
}

export interface ITaskAllParams {
  habitId?: string;
}

export interface ITaskCreateParams {
  completed: boolean;
  completionDate: string;
  difficulty?: number | null;
  habitId: string;
  id?: string | null;
  rating?: number | null;
}

export interface ITaskDestroyParams {
  id: string;
}

export interface ITaskFindParams {
  id: string;
}

export interface ITaskUpdateParams {
  completed?: boolean | null;
  completionDate?: string | null;
  difficulty?: number | null;
  id: string;
  rating?: number | null;
}
