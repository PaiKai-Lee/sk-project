const FEATURE_NAME = 'user-notifications';

export const userNotificationQueryKeys = {
  all: [FEATURE_NAME] as const,
  getUserNotifications: (params?: any) => [FEATURE_NAME, params] as const,
  getUnreadNotificationsCount: (params?: any) =>
    [FEATURE_NAME, 'user-notifications-unread-count', params] as const,
};
