import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../services/catalog.service";

export function useCatalogItemsList(params: { page: number; perPage: number }) {
  return useQuery({
    queryKey: ["catalog-items", "list", params],
    queryFn: () => catalogService.list(params),
  });
}
