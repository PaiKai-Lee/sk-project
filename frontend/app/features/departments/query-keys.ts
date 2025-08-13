const FEATURE_NAME = 'departments';

export const departmentQueryKeys = {
  all: [FEATURE_NAME] as const,
  getDepartments: (params?: any) => [FEATURE_NAME, params] as const,
  getOneDepartment: (id: string) => [FEATURE_NAME, id] as const
};
