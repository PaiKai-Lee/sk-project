const FEATURE_NAME = 'notifications';

export const notificationQueryKeys = {
  all: [FEATURE_NAME] as const,
  getNotifications: (params?: any) => [FEATURE_NAME, params] as const,
};
