import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type { CatalogItem } from "../types/catalog.types";

const BASE_URL = "/catalog/items";

export const catalogService = {
  async list(params: { page: number; perPage: number }): Promise<PaginatedResponse<CatalogItem>> {
    const { data } = await axiosInstance.get<PaginatedResponse<CatalogItem>>(BASE_URL, { params });
    return data;
  },
};
