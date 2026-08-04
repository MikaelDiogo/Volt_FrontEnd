import { useQuery } from "@tanstack/react-query";
import { salesService } from "../services/sales.service";

export function useSalesList(params: { page: number; perPage: number }) {
  return useQuery({
    queryKey: ["sales", "list", params],
    queryFn: () => salesService.list(params),
  });
}
