import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type { Sale } from "../types/sale.types";

const BASE_URL = "/sales";

export const salesService = {
  async list(params: { page: number; perPage: number }): Promise<PaginatedResponse<Sale>> {
    const { data } = await axiosInstance.get<PaginatedResponse<Sale>>(BASE_URL, { params });
    return data;
  },
};
