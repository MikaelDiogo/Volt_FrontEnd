import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceOrdersService } from "../services/service-orders.service";
import type {
  CreateServiceOrderDto,
  UpdateServiceOrderDto,
  ListServiceOrdersParams,
} from "../types/service-order.types";

const QUERY_KEY = "service-orders";

export function useServiceOrdersList(
  params: ListServiceOrdersParams,
  options?: { refetchInterval?: number; staleTime?: number },
) {
  return useQuery({
    queryKey: [QUERY_KEY, "list", params],
    queryFn: () => serviceOrdersService.list(params),
    ...options,
  });
}

export function useServiceOrderDetail(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, "detail", id],
    queryFn: () => serviceOrdersService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateServiceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateServiceOrderDto) => serviceOrdersService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] });
    },
  });
}

export function useUpdateServiceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateServiceOrderDto }) =>
      serviceOrdersService.update(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "detail", variables.id] });
    },
  });
}

export function useDeleteServiceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceOrdersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] });
    },
  });
}
