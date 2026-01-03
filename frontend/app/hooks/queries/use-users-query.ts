import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import {
  UserClient,
  userQueryKeys,
  type IUsersResponse,
} from '~/features/users';
import { type SortingState } from '@tanstack/react-table';

type GetUsersParams = {
  showDisable?: boolean;
  fields?: string[];
  sorting?: SortingState;
};

type UseUsersQueryOptions<TData = IUsersResponse> = Omit<
  UseQueryOptions<IUsersResponse, Error, TData>,
  'queryKey' | 'queryFn' | 'select'
>;

export function useUsersQuery<TData = IUsersResponse>({
  params,
  options,
}: {
  params?: GetUsersParams;
  options?: UseUsersQueryOptions<TData>;
} = {}) {
  return useQuery({
    queryKey: userQueryKeys.getUsers(params),
    queryFn: async () => {
      if (!params) return await UserClient.getUsers();
      const searchParams = new URLSearchParams();
      if (params.showDisable !== undefined)
        searchParams.append('showDisable', params.showDisable.toString());
      if (params.fields) {
        params.fields.forEach((field) => {
          searchParams.append('fields', field);
        });
      }
      if (params.sorting) {
        params.sorting.forEach((item) => {
          searchParams.append(
            'sort',
            `${item.id}:${item.desc ? 'desc' : 'asc'}`
          );
        });
      }
      return await UserClient.getUsers({
        params: searchParams,
      });
    },
    // Your select function is kept as is
    select: ({ data }) => data.data,
    ...options,
  });
}
