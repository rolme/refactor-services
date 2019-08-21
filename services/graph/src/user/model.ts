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
      required: false,
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
    expiresAt: {
      type: String,
    },
    id: {
      hashKey: true,
      required: true,
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
    sort: {
      default: new Date().getTime(),
      index: true,
      rangeKey: true,
      type: String,
    },
    status: {
      type: String,
    },
    updatedAt: {
      required: true,
      type: String,
    },
    welcomeEmailPending: {
      index: {
        global: true,
        name: 'WelcomeEmailPendingIndex',
        project: true,
      },
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IUser, { id: string }>(
  process.env.TABLE_REFACTOR || 'Users',
  UserSchema,
);
