import { useQuery } from "@tanstack/react-query";
import { financialService } from "../services/financial.service";

export function useFinancialTransactionsList(params: { page: number; perPage: number }) {
  return useQuery({
    queryKey: ["financial-transactions", "list", params],
    queryFn: () => financialService.list(params),
  });
}
