/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum Category {
  EAT = "EAT",
  FOCUS = "FOCUS",
  MOVE = "MOVE",
  SLEEP = "SLEEP",
}


// #### Enumarations
export enum UserStatus {
  EXPIRED = "EXPIRED",
  GENERAL = "GENERAL",
  SUBSCRIBER = "SUBSCRIBER",
  TRIAL = "TRIAL",
}


export type S3ObjectInput = {
  bucket: string,
  key: string,
  localUri?: string | null,
  mimeType: string,
  region: string,
};

export type ProfileInput = {
  address?: AddressInput | null,
  email?: string | null,
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

export type GetUserQuery = {
  getUser:  {
    __typename: "User",
    avatar:  {
      __typename: "S3Object",
      bucket: string,
      key: string,
      region: string,
      mimeType: string,
    } | null,
    createdAt: string,
    email: string,
    expiresAt: string | null,
    habits:  Array< {
      __typename: "Habit",
      category: Category,
      createdAt: string,
      deletedAt: string | null,
      description: string,
      enableWeekends: boolean | null,
      id: string,
      place: string | null,
      sort: string,
      tasks:  Array< {
        __typename: "Task",
        completionDate: string | null,
        completed: boolean | null,
        createdAt: string,
        difficulty: number | null,
        rating: number | null,
        updatedAt: string,
        version: string | null,
      } >,
      time: string,
      trigger: string | null,
      updatedAt: string,
      userId: string,
      user:  {
        __typename: "User",
        createdAt: string,
        email: string,
        expiresAt: string | null,
        id: string,
        name: string | null,
        role: string,
        updatedAt: string,
        welcomeSentAt: string | null,
      },
      why: string | null,
    } >,
    id: string,
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
      phone: string | null,
      title: string | null,
      website: string | null,
    } | null,
    role: string,
    status: UserStatus,
    tasks:  Array< {
      __typename: "Task",
      completionDate: string | null,
      completed: boolean | null,
      createdAt: string,
      difficulty: number | null,
      habit:  {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      },
      rating: number | null,
      updatedAt: string,
      version: string | null,
    } >,
    updatedAt: string,
    welcomeSentAt: string | null,
  },
};

export type GetUsersQuery = {
  getUsers:  Array< {
    __typename: "User",
    avatar:  {
      __typename: "S3Object",
      bucket: string,
      key: string,
      region: string,
      mimeType: string,
    } | null,
    createdAt: string,
    email: string,
    expiresAt: string | null,
    habits:  Array< {
      __typename: "Habit",
      category: Category,
      createdAt: string,
      deletedAt: string | null,
      description: string,
      enableWeekends: boolean | null,
      id: string,
      place: string | null,
      sort: string,
      tasks:  Array< {
        __typename: "Task",
        completionDate: string | null,
        completed: boolean | null,
        createdAt: string,
        difficulty: number | null,
        rating: number | null,
        updatedAt: string,
        version: string | null,
      } >,
      time: string,
      trigger: string | null,
      updatedAt: string,
      userId: string,
      user:  {
        __typename: "User",
        createdAt: string,
        email: string,
        expiresAt: string | null,
        id: string,
        name: string | null,
        role: string,
        updatedAt: string,
        welcomeSentAt: string | null,
      },
      why: string | null,
    } >,
    id: string,
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
      phone: string | null,
      title: string | null,
      website: string | null,
    } | null,
    role: string,
    status: UserStatus,
    tasks:  Array< {
      __typename: "Task",
      completionDate: string | null,
      completed: boolean | null,
      createdAt: string,
      difficulty: number | null,
      habit:  {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      },
      rating: number | null,
      updatedAt: string,
      version: string | null,
    } >,
    updatedAt: string,
    welcomeSentAt: string | null,
  } >,
};

export type GetHabitQueryVariables = {
  id: string,
};

export type GetHabitQuery = {
  getHabit:  {
    __typename: "Habit",
    category: Category,
    createdAt: string,
    deletedAt: string | null,
    description: string,
    enableWeekends: boolean | null,
    id: string,
    place: string | null,
    sort: string,
    tasks:  Array< {
      __typename: "Task",
      completionDate: string | null,
      completed: boolean | null,
      createdAt: string,
      difficulty: number | null,
      habit:  {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      },
      rating: number | null,
      updatedAt: string,
      version: string | null,
    } >,
    time: string,
    trigger: string | null,
    updatedAt: string,
    userId: string,
    user:  {
      __typename: "User",
      avatar:  {
        __typename: "S3Object",
        bucket: string,
        key: string,
        region: string,
        mimeType: string,
      } | null,
      createdAt: string,
      email: string,
      expiresAt: string | null,
      habits:  Array< {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      } >,
      id: string,
      name: string | null,
      profile:  {
        __typename: "Profile",
        phone: string | null,
        title: string | null,
        website: string | null,
      } | null,
      role: string,
      status: UserStatus,
      tasks:  Array< {
        __typename: "Task",
        completionDate: string | null,
        completed: boolean | null,
        createdAt: string,
        difficulty: number | null,
        rating: number | null,
        updatedAt: string,
        version: string | null,
      } >,
      updatedAt: string,
      welcomeSentAt: string | null,
    },
    why: string | null,
  } | null,
};

export type GetHabitsQueryVariables = {
  userId?: string | null,
};

export type GetHabitsQuery = {
  getHabits:  Array< {
    __typename: "Habit",
    category: Category,
    createdAt: string,
    deletedAt: string | null,
    description: string,
    enableWeekends: boolean | null,
    id: string,
    place: string | null,
    sort: string,
    tasks:  Array< {
      __typename: "Task",
      completionDate: string | null,
      completed: boolean | null,
      createdAt: string,
      difficulty: number | null,
      habit:  {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      },
      rating: number | null,
      updatedAt: string,
      version: string | null,
    } >,
    time: string,
    trigger: string | null,
    updatedAt: string,
    userId: string,
    user:  {
      __typename: "User",
      avatar:  {
        __typename: "S3Object",
        bucket: string,
        key: string,
        region: string,
        mimeType: string,
      } | null,
      createdAt: string,
      email: string,
      expiresAt: string | null,
      habits:  Array< {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      } >,
      id: string,
      name: string | null,
      profile:  {
        __typename: "Profile",
        phone: string | null,
        title: string | null,
        website: string | null,
      } | null,
      role: string,
      status: UserStatus,
      tasks:  Array< {
        __typename: "Task",
        completionDate: string | null,
        completed: boolean | null,
        createdAt: string,
        difficulty: number | null,
        rating: number | null,
        updatedAt: string,
        version: string | null,
      } >,
      updatedAt: string,
      welcomeSentAt: string | null,
    },
    why: string | null,
  } >,
};

export type GetTaskQueryVariables = {
  id: string,
};

export type GetTaskQuery = {
  getTask:  {
    __typename: "Task",
    completionDate: string | null,
    completed: boolean | null,
    createdAt: string,
    difficulty: number | null,
    habit:  {
      __typename: "Habit",
      category: Category,
      createdAt: string,
      deletedAt: string | null,
      description: string,
      enableWeekends: boolean | null,
      id: string,
      place: string | null,
      sort: string,
      tasks:  Array< {
        __typename: "Task",
        completionDate: string | null,
        completed: boolean | null,
        createdAt: string,
        difficulty: number | null,
        rating: number | null,
        updatedAt: string,
        version: string | null,
      } >,
      time: string,
      trigger: string | null,
      updatedAt: string,
      userId: string,
      user:  {
        __typename: "User",
        createdAt: string,
        email: string,
        expiresAt: string | null,
        id: string,
        name: string | null,
        role: string,
        updatedAt: string,
        welcomeSentAt: string | null,
      },
      why: string | null,
    },
    rating: number | null,
    updatedAt: string,
    version: string | null,
  } | null,
};

export type GetTasksQueryVariables = {
  habitId?: string | null,
};

export type GetTasksQuery = {
  getTasks:  Array< {
    __typename: "Task",
    completionDate: string | null,
    completed: boolean | null,
    createdAt: string,
    difficulty: number | null,
    habit:  {
      __typename: "Habit",
      category: Category,
      createdAt: string,
      deletedAt: string | null,
      description: string,
      enableWeekends: boolean | null,
      id: string,
      place: string | null,
      sort: string,
      tasks:  Array< {
        __typename: "Task",
        completionDate: string | null,
        completed: boolean | null,
        createdAt: string,
        difficulty: number | null,
        rating: number | null,
        updatedAt: string,
        version: string | null,
      } >,
      time: string,
      trigger: string | null,
      updatedAt: string,
      userId: string,
      user:  {
        __typename: "User",
        createdAt: string,
        email: string,
        expiresAt: string | null,
        id: string,
        name: string | null,
        role: string,
        updatedAt: string,
        welcomeSentAt: string | null,
      },
      why: string | null,
    },
    rating: number | null,
    updatedAt: string,
    version: string | null,
  } >,
};

export type CreateHabitMutationVariables = {
  category: Category,
  description: string,
  enableWeekends?: boolean | null,
  id?: string | null,
  place?: string | null,
  time?: string | null,
  trigger?: string | null,
  userId?: string | null,
  why?: string | null,
};

export type CreateHabitMutation = {
  createHabit:  {
    __typename: "Habit",
    category: Category,
    createdAt: string,
    deletedAt: string | null,
    description: string,
    enableWeekends: boolean | null,
    id: string,
    place: string | null,
    sort: string,
    tasks:  Array< {
      __typename: "Task",
      completionDate: string | null,
      completed: boolean | null,
      createdAt: string,
      difficulty: number | null,
      habit:  {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      },
      rating: number | null,
      updatedAt: string,
      version: string | null,
    } >,
    time: string,
    trigger: string | null,
    updatedAt: string,
    userId: string,
    user:  {
      __typename: "User",
      avatar:  {
        __typename: "S3Object",
        bucket: string,
        key: string,
        region: string,
        mimeType: string,
      } | null,
      createdAt: string,
      email: string,
      expiresAt: string | null,
      habits:  Array< {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      } >,
      id: string,
      name: string | null,
      profile:  {
        __typename: "Profile",
        phone: string | null,
        title: string | null,
        website: string | null,
      } | null,
      role: string,
      status: UserStatus,
      tasks:  Array< {
        __typename: "Task",
        completionDate: string | null,
        completed: boolean | null,
        createdAt: string,
        difficulty: number | null,
        rating: number | null,
        updatedAt: string,
        version: string | null,
      } >,
      updatedAt: string,
      welcomeSentAt: string | null,
    },
    why: string | null,
  } | null,
};

export type DeleteHabitMutationVariables = {
  id: string,
  userId?: string | null,
};

export type DeleteHabitMutation = {
  deleteHabit:  {
    __typename: "Habit",
    category: Category,
    createdAt: string,
    deletedAt: string | null,
    description: string,
    enableWeekends: boolean | null,
    id: string,
    place: string | null,
    sort: string,
    tasks:  Array< {
      __typename: "Task",
      completionDate: string | null,
      completed: boolean | null,
      createdAt: string,
      difficulty: number | null,
      habit:  {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      },
      rating: number | null,
      updatedAt: string,
      version: string | null,
    } >,
    time: string,
    trigger: string | null,
    updatedAt: string,
    userId: string,
    user:  {
      __typename: "User",
      avatar:  {
        __typename: "S3Object",
        bucket: string,
        key: string,
        region: string,
        mimeType: string,
      } | null,
      createdAt: string,
      email: string,
      expiresAt: string | null,
      habits:  Array< {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      } >,
      id: string,
      name: string | null,
      profile:  {
        __typename: "Profile",
        phone: string | null,
        title: string | null,
        website: string | null,
      } | null,
      role: string,
      status: UserStatus,
      tasks:  Array< {
        __typename: "Task",
        completionDate: string | null,
        completed: boolean | null,
        createdAt: string,
        difficulty: number | null,
        rating: number | null,
        updatedAt: string,
        version: string | null,
      } >,
      updatedAt: string,
      welcomeSentAt: string | null,
    },
    why: string | null,
  } | null,
};

export type DeleteUserMutation = {
  deleteUser:  {
    __typename: "User",
    avatar:  {
      __typename: "S3Object",
      bucket: string,
      key: string,
      region: string,
      mimeType: string,
    } | null,
    createdAt: string,
    email: string,
    expiresAt: string | null,
    habits:  Array< {
      __typename: "Habit",
      category: Category,
      createdAt: string,
      deletedAt: string | null,
      description: string,
      enableWeekends: boolean | null,
      id: string,
      place: string | null,
      sort: string,
      tasks:  Array< {
        __typename: "Task",
        completionDate: string | null,
        completed: boolean | null,
        createdAt: string,
        difficulty: number | null,
        rating: number | null,
        updatedAt: string,
        version: string | null,
      } >,
      time: string,
      trigger: string | null,
      updatedAt: string,
      userId: string,
      user:  {
        __typename: "User",
        createdAt: string,
        email: string,
        expiresAt: string | null,
        id: string,
        name: string | null,
        role: string,
        updatedAt: string,
        welcomeSentAt: string | null,
      },
      why: string | null,
    } >,
    id: string,
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
      phone: string | null,
      title: string | null,
      website: string | null,
    } | null,
    role: string,
    status: UserStatus,
    tasks:  Array< {
      __typename: "Task",
      completionDate: string | null,
      completed: boolean | null,
      createdAt: string,
      difficulty: number | null,
      habit:  {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      },
      rating: number | null,
      updatedAt: string,
      version: string | null,
    } >,
    updatedAt: string,
    welcomeSentAt: string | null,
  } | null,
};

export type UpdateHabitMutationVariables = {
  category?: Category | null,
  description?: string | null,
  enableWeekends?: boolean | null,
  id: string,
  place?: string | null,
  time?: string | null,
  trigger?: string | null,
  userId?: string | null,
  why?: string | null,
};

export type UpdateHabitMutation = {
  updateHabit:  {
    __typename: "Habit",
    category: Category,
    createdAt: string,
    deletedAt: string | null,
    description: string,
    enableWeekends: boolean | null,
    id: string,
    place: string | null,
    sort: string,
    tasks:  Array< {
      __typename: "Task",
      completionDate: string | null,
      completed: boolean | null,
      createdAt: string,
      difficulty: number | null,
      habit:  {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      },
      rating: number | null,
      updatedAt: string,
      version: string | null,
    } >,
    time: string,
    trigger: string | null,
    updatedAt: string,
    userId: string,
    user:  {
      __typename: "User",
      avatar:  {
        __typename: "S3Object",
        bucket: string,
        key: string,
        region: string,
        mimeType: string,
      } | null,
      createdAt: string,
      email: string,
      expiresAt: string | null,
      habits:  Array< {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      } >,
      id: string,
      name: string | null,
      profile:  {
        __typename: "Profile",
        phone: string | null,
        title: string | null,
        website: string | null,
      } | null,
      role: string,
      status: UserStatus,
      tasks:  Array< {
        __typename: "Task",
        completionDate: string | null,
        completed: boolean | null,
        createdAt: string,
        difficulty: number | null,
        rating: number | null,
        updatedAt: string,
        version: string | null,
      } >,
      updatedAt: string,
      welcomeSentAt: string | null,
    },
    why: string | null,
  },
};

export type UpdateUserMutationVariables = {
  avatar?: S3ObjectInput | null,
  email?: string | null,
  name?: string | null,
  profile?: ProfileInput | null,
};

export type UpdateUserMutation = {
  updateUser:  {
    __typename: "User",
    avatar:  {
      __typename: "S3Object",
      bucket: string,
      key: string,
      region: string,
      mimeType: string,
    } | null,
    createdAt: string,
    email: string,
    expiresAt: string | null,
    habits:  Array< {
      __typename: "Habit",
      category: Category,
      createdAt: string,
      deletedAt: string | null,
      description: string,
      enableWeekends: boolean | null,
      id: string,
      place: string | null,
      sort: string,
      tasks:  Array< {
        __typename: "Task",
        completionDate: string | null,
        completed: boolean | null,
        createdAt: string,
        difficulty: number | null,
        rating: number | null,
        updatedAt: string,
        version: string | null,
      } >,
      time: string,
      trigger: string | null,
      updatedAt: string,
      userId: string,
      user:  {
        __typename: "User",
        createdAt: string,
        email: string,
        expiresAt: string | null,
        id: string,
        name: string | null,
        role: string,
        updatedAt: string,
        welcomeSentAt: string | null,
      },
      why: string | null,
    } >,
    id: string,
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
      phone: string | null,
      title: string | null,
      website: string | null,
    } | null,
    role: string,
    status: UserStatus,
    tasks:  Array< {
      __typename: "Task",
      completionDate: string | null,
      completed: boolean | null,
      createdAt: string,
      difficulty: number | null,
      habit:  {
        __typename: "Habit",
        createdAt: string,
        deletedAt: string | null,
        description: string,
        enableWeekends: boolean | null,
        id: string,
        place: string | null,
        sort: string,
        time: string,
        trigger: string | null,
        updatedAt: string,
        userId: string,
        why: string | null,
      },
      rating: number | null,
      updatedAt: string,
      version: string | null,
    } >,
    updatedAt: string,
    welcomeSentAt: string | null,
  },
};
