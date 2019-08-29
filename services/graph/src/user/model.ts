import { model, Schema } from 'dynamoose';
import { IUser } from './types';

const UserSchema = new Schema(
  {
    admin: {
      default: false,
      required: true,
      type: Boolean,
    },
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
    confirmedAt: {
      type: String,
    },
    createdAt: {
      required: true,
      type: String,
    },
    disabled: {
      default: false,
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    entity: {
      required: true,
      type: String,
    },
    expiresAt: {
      type: String,
    },
    id: {
      hashKey: true,
      index: {
        global: true,
        rangeKey: 'key',
      },
      required: true,
      type: String,
    },
    key: {
      rangeKey: true,
      required: true,
      type: String,
    },
    name: {
      type: String,
    },
    profile: {
      default: null,
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
        email: {
          type: String,
        },
        entity: {
          type: String,
        },
        localAgency: {
          type: String,
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
    resetAt: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    scope: {
      type: String,
    },
    status: {
      default: 'TRIAL',
      enum: ['EXPIRED', 'GENERAL', 'SUBSCRIBER', 'TRIAL'],
      required: true,
      type: String,
    },
    updatedAt: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IUser, { id: string; key: string }>(
  process.env.TABLE_REFACTOR || 'Refactor',
  UserSchema,
  {
    create: true,
    update: true,
  },
);
