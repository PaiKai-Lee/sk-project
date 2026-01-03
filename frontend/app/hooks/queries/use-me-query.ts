import { useQuery } from "@tanstack/react-query";
import { MeClient, meQueryKeys } from "~/features/me";
import type { GetBalanceLogsDto } from "~/features/me";


export function useMeQuery() {
  return useQuery({
    queryKey: meQueryKeys.get(),
    queryFn: () => MeClient.get(),
    select: ({ data }) => data.data,
  })
}

export function useBalanceLogsQuery(params : GetBalanceLogsDto) {
  return useQuery({
    queryKey: meQueryKeys.getBalanceLogs(params),
    queryFn: () => MeClient.getBalanceLogs(params),
    select: ({ data }) => data.data,
  })
}