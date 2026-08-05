import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financialService } from "../services/financial.service";
import type {
  CreateFinancialTransactionDto,
  UpdateFinancialTransactionDto,
  ListFinancialTransactionsParams,
} from "../types/financial.types";

const QUERY_KEY = "financial-transactions";

export function useFinancialTransactionsList(params: ListFinancialTransactionsParams) {
  return useQuery({
    queryKey: [QUERY_KEY, "list", params],
    queryFn: () => financialService.list(params),
  });
}

export function useCreateFinancialTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateFinancialTransactionDto) => financialService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] });
    },
  });
}

export function useUpdateFinancialTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateFinancialTransactionDto }) =>
      financialService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] });
    },
  });
}

export function useMarkPaidFinancialTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financialService.markPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] });
    },
  });
}

export function useDeleteFinancialTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financialService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] });
    },
  });
}
