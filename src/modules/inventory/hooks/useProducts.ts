import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services/products.service";
import type { CreateProductDto, UpdateProductDto, ListProductsParams } from "../types/product.types";

const QUERY_KEY = "products";

export function useProductsList(
  params: ListProductsParams,
  options?: { refetchInterval?: number; staleTime?: number },
) {
  return useQuery({
    queryKey: [QUERY_KEY, "list", params],
    queryFn: () => productsService.list(params),
    ...options,
  });
}

export function useProductDetail(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, "detail", id],
    queryFn: () => productsService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProductDto) => productsService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) => productsService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] }),
  });
}
