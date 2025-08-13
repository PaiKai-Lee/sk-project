const FEATURE_NAME = 'overview';

export const overviewQueryKeys = {
  all: [FEATURE_NAME] as const,
  getOverview: (params?: any) => [FEATURE_NAME, params] as const,
};
