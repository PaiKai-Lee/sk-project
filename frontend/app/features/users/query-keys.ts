import { all } from 'axios';

const FEATURE_NAME = 'users';

export const userQueryKeys = {
  all: [FEATURE_NAME] as const,
  getUsers: (params?: any) => [FEATURE_NAME, params] as const,
  getOneUser: (id: string) => [FEATURE_NAME, id] as const,
};
