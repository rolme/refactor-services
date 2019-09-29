import { model, Schema } from 'dynamoose';
import { schema } from '../types';
import { IUser } from './types';

const UserSchema = new Schema(
  {
    ...schema,
    avatar: {
      default: null,
      map: {
        bucket: {
          required: true,
          type: String,
        },
        key: {
          required: true,
          type: String,
        },
        mimeType: {
          required: true,
          type: String,
        },
        region: {
          required: true,
          type: String,
        },
      },
      type: Map,
    },
    email: {
      required: true,
      type: String,
    },
    expiresAt: {
      type: String,
    },
    name: {
      type: String,
    },
    profile: {
      default: {},
      map: {
        address: {
          default: {},
          map: {
            country: {
              type: String,
            },
            locality: {
              type: String,
            },
            postalCode: {
              type: String,
            },
            region: {
              type: String,
            },
            street: {
              list: [
                {
                  type: String,
                },
              ],
              required: true,
              type: 'list',
            },
          },
          type: Map,
        },
        phone: {
          type: String,
        },
        title: {
          type: String,
        },
        website: {
          type: String,
        },
      },
      type: Map,
    },
    role: {
      type: String,
    },
    source: {
      type: String,
    },
    status: {
      type: String,
    },
    welcomeSentAt: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IUser, { hash: string; range: string }>(
  'USER',
  UserSchema,
  {
    create: true,
    tableName: process.env.TABLE_REFACTOR || 'Refactor',
    update: true,
  },
);
