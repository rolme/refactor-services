export * from './lambda';
export * from './schema';

export interface IHash {
  [key: string]: any;
}

export interface IModel {
  createdAt?: string;
  hash: string;
  id: string;
  range: string;
  scope?: string;
  type: string;
  updatedAt?: string;
}

export const schema = {
  createdAt: {
    type: String,
  },
  hash: {
    hashKey: true,
    required: true,
    type: String,
  },
  id: {
    type: String,
  },
  range: {
    rangeKey: true,
    required: true,
    type: String,
  },
  scope: {
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
  updatedAt: {
    type: String,
  },
};

export enum ItemType {
  TASK = 'TASK',
  HABIT = 'HABIT',
  USER = 'USER',
  TYPES = 'TYPES',
}
