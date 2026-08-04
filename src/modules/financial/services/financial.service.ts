import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type { FinancialTransaction } from "../types/financial.types";

const BASE_URL = "/financial/transactions";

export const financialService = {
  async list(params: { page: number; perPage: number }): Promise<PaginatedResponse<FinancialTransaction>> {
    const { data } = await axiosInstance.get<PaginatedResponse<FinancialTransaction>>(BASE_URL, { params });
    return data;
  },
};
