export const FEATURE_NAME = 'auth';

export const authQueryKeys = {
  all: [FEATURE_NAME] as const,
  getProfile: () => [FEATURE_NAME, 'profile'] as const,
};
