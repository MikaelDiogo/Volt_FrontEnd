import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customersService } from "../services/customers.service";
import type { CreateCustomerDto, UpdateCustomerDto, ListCustomersParams } from "../types/customer.types";

const QUERY_KEY = "customers";

export function useCustomersList(params: ListCustomersParams) {
  return useQuery({
    queryKey: [QUERY_KEY, "list", params],
    queryFn: () => customersService.list(params),
  });
}

export function useCustomerDetail(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, "detail", id],
    queryFn: () => customersService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCustomerServiceOrders(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, "service-orders", id],
    queryFn: () => customersService.listServiceOrders(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCustomerDto) => customersService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] }),
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCustomerDto }) => customersService.update(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "detail", variables.id] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customersService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] }),
  });
}
