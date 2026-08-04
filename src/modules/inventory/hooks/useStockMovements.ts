import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stockMovementsService } from "../services/stock-movements.service";
import type { CreateStockMovementDto } from "../types/stock-movement.types";

const QUERY_KEY = "stock-movements";

export function useStockMovementsList(productId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, "list", productId],
    queryFn: () => stockMovementsService.list(productId as string),
    enabled: Boolean(productId),
  });
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, dto }: { productId: string; dto: CreateStockMovementDto }) =>
      stockMovementsService.create(productId, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
    },
  });
}
