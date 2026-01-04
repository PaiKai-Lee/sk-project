import { useQuery } from '@tanstack/react-query';
import { departmentQueryKeys, DepartmentClient } from '~/features/departments';

export function useDepartmentQuery() {
  return useQuery({
    queryKey: departmentQueryKeys.getDepartments(),
    queryFn: () => DepartmentClient.getDepartments(),
    select: ({ data }) => data.data,
    staleTime: 60 * 1000 * 60,
  });
}
