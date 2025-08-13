const FEATURE_NAME = 'roles';

export const roleQueryKeys = {
  all: [FEATURE_NAME] as const,
  getRoles: (params?: any) => [FEATURE_NAME, params] as const,
};
