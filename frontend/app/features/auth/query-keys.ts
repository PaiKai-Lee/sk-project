export const FEATURE_NAME = 'auth';

export const authQueryKeys = {
  all: [FEATURE_NAME] as const,
  getProfile: () => [FEATURE_NAME, 'profile'] as const,
  login: () => [FEATURE_NAME, 'login'] as const,
  logout: () => [FEATURE_NAME, 'logout'] as const,
  refreshToken: () => [FEATURE_NAME, 'refresh-token'] as const,
};
