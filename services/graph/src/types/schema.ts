/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum AccountState {
  FREE_TRIAL = "FREE_TRIAL",
  ACTIVE_SUBSCRIBER = "ACTIVE_SUBSCRIBER",
  EXPIRING_SUBSCRIBER = "EXPIRING_SUBSCRIBER",
  EXPIRED = "EXPIRED",
}


export type ProfileInput = {
  address?: AddressInput | null,
  email?: string | null,
  entity?: string | null,
  localAgency?: string | null,
  phone?: string | null,
  title?: string | null,
  website?: string | null,
};

export type AddressInput = {
  country?: string | null,
  locality?: string | null,
  postalCode?: string | null,
  region?: string | null,
  street: Array< string | null >,
};

export type S3ObjectInput = {
  bucket: string,
  key: string,
  localUri?: string | null,
  mimeType: string,
  region: string,
};

export type GetUserQuery = {
  getUser:  {
    __typename: "User",
    id: string,
    email: string,
    name: string | null,
    profile:  {
      __typename: "Profile",
      address:  {
        __typename: "Address",
        country: string | null,
        locality: string | null,
        postalCode: string | null,
        region: string | null,
        street: Array< string | null > | null,
      } | null,
      email: string | null,
      entity: string | null,
      localAgency: string | null,
      phone: string | null,
      title: string | null,
      website: string | null,
    } | null,
    picture:  {
      __typename: "S3Object",
      bucket: string,
      key: string,
      region: string,
      mimeType: string,
    } | null,
    state: AccountState,
    expiresAt: string | null,
    updatedAt: string,
    createdAt: string,
  },
};

export type GetAppsQuery = {
  getApps:  Array< {
    __typename: "App",
    id: string | null,
    name: string,
    userId: string,
    eventType:  Array< {
      __typename: "EventType",
      id: string | null,
      name: string,
      match: string | null,
      pre_margin: number,
      post_margin: number,
      properties: string,
    } >,
    source:  Array< {
      __typename: "Source",
      id: string | null,
      name: string,
      properties: string,
      variables:  Array< {
        __typename: "Variable",
        name: string,
        value: string,
      } >,
    } >,
    events:  Array< {
      __typename: "Event",
      id: string | null,
      eventType:  {
        __typename: "EventType",
        id: string | null,
        name: string,
        match: string | null,
        pre_margin: number,
        post_margin: number,
        properties: string,
      },
      source:  {
        __typename: "Source",
        id: string | null,
        name: string,
        properties: string,
        variables:  Array< {
          __typename: "Variable",
          name: string,
          value: string,
        } >,
      },
      timestamp: string,
      properties: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } >,
};

export type GetEventTypesQueryVariables = {
  appName?: string | null,
};

export type GetEventTypesQuery = {
  getEventTypes:  Array< {
    __typename: "EventType",
    id: string | null,
    name: string,
    match: string | null,
    pre_margin: number,
    post_margin: number,
    properties: string,
  } >,
};

export type GetEventsQueryVariables = {
  appName?: string | null,
};

export type GetEventsQuery = {
  getEvents:  Array< {
    __typename: "Event",
    id: string | null,
    eventType:  {
      __typename: "EventType",
      id: string | null,
      name: string,
      match: string | null,
      pre_margin: number,
      post_margin: number,
      properties: string,
    },
    source:  {
      __typename: "Source",
      id: string | null,
      name: string,
      properties: string,
      variables:  Array< {
        __typename: "Variable",
        name: string,
        value: string,
      } >,
    },
    timestamp: string,
    properties: string,
  } >,
};

export type DeleteUserMutation = {
  deleteUser:  {
    __typename: "User",
    id: string,
    email: string,
    name: string | null,
    profile:  {
      __typename: "Profile",
      address:  {
        __typename: "Address",
        country: string | null,
        locality: string | null,
        postalCode: string | null,
        region: string | null,
        street: Array< string | null > | null,
      } | null,
      email: string | null,
      entity: string | null,
      localAgency: string | null,
      phone: string | null,
      title: string | null,
      website: string | null,
    } | null,
    picture:  {
      __typename: "S3Object",
      bucket: string,
      key: string,
      region: string,
      mimeType: string,
    } | null,
    state: AccountState,
    expiresAt: string | null,
    updatedAt: string,
    createdAt: string,
  },
};

export type UpdateUserMutationVariables = {
  email?: string | null,
  name?: string | null,
  profile?: ProfileInput | null,
  picture?: S3ObjectInput | null,
};

export type UpdateUserMutation = {
  updateUser:  {
    __typename: "User",
    id: string,
    email: string,
    name: string | null,
    profile:  {
      __typename: "Profile",
      address:  {
        __typename: "Address",
        country: string | null,
        locality: string | null,
        postalCode: string | null,
        region: string | null,
        street: Array< string | null > | null,
      } | null,
      email: string | null,
      entity: string | null,
      localAgency: string | null,
      phone: string | null,
      title: string | null,
      website: string | null,
    } | null,
    picture:  {
      __typename: "S3Object",
      bucket: string,
      key: string,
      region: string,
      mimeType: string,
    } | null,
    state: AccountState,
    expiresAt: string | null,
    updatedAt: string,
    createdAt: string,
  },
};

export type OnDeleteUserSubscription = {
  onDeleteUser:  {
    __typename: "User",
    id: string,
    email: string,
    name: string | null,
    profile:  {
      __typename: "Profile",
      address:  {
        __typename: "Address",
        country: string | null,
        locality: string | null,
        postalCode: string | null,
        region: string | null,
        street: Array< string | null > | null,
      } | null,
      email: string | null,
      entity: string | null,
      localAgency: string | null,
      phone: string | null,
      title: string | null,
      website: string | null,
    } | null,
    picture:  {
      __typename: "S3Object",
      bucket: string,
      key: string,
      region: string,
      mimeType: string,
    } | null,
    state: AccountState,
    expiresAt: string | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser:  {
    __typename: "User",
    id: string,
    email: string,
    name: string | null,
    profile:  {
      __typename: "Profile",
      address:  {
        __typename: "Address",
        country: string | null,
        locality: string | null,
        postalCode: string | null,
        region: string | null,
        street: Array< string | null > | null,
      } | null,
      email: string | null,
      entity: string | null,
      localAgency: string | null,
      phone: string | null,
      title: string | null,
      website: string | null,
    } | null,
    picture:  {
      __typename: "S3Object",
      bucket: string,
      key: string,
      region: string,
      mimeType: string,
    } | null,
    state: AccountState,
    expiresAt: string | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};
