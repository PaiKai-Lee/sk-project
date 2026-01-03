const FEATURE_NAME = 'users';

export const userQueryKeys = {
  all: [FEATURE_NAME] as const,
  getUsers: (params?: any) => [FEATURE_NAME, 'list', params] as const,
  getOneUser: (id: string) => [FEATURE_NAME, 'detail', id] as const,
};
