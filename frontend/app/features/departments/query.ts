import { DepartmentClient } from './api';
import { queryOptions } from '@tanstack/react-query';
export const departmentQueryKeys = {
  all: ['departments'] as const,
  getDepartments: (params?: any) =>
    [...departmentQueryKeys.all, params] as const,
  getOneDepartment: (id: string) => [...departmentQueryKeys.all, id] as const,
} as const;

export const getDepartmentsOptions = () =>
  queryOptions({
    queryKey: departmentQueryKeys.getDepartments(),
    queryFn: async () => {
      const { data } = await DepartmentClient.getDepartments();
      return data;
    },
    select: (data) => data.data,
    staleTime: 60 * 1000 * 60,
  });
