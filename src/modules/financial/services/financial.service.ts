import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type {
  FinancialTransaction,
  CreateFinancialTransactionDto,
  UpdateFinancialTransactionDto,
  ListFinancialTransactionsParams,
} from "../types/financial.types";

const BASE_URL = "/financial-transactions";

export const financialService = {
  async list(params: ListFinancialTransactionsParams): Promise<PaginatedResponse<FinancialTransaction>> {
    const { data } = await axiosInstance.get<PaginatedResponse<FinancialTransaction>>(BASE_URL, { params });
    return data;
  },

  async get(id: string): Promise<FinancialTransaction> {
    const { data } = await axiosInstance.get<FinancialTransaction>(`${BASE_URL}/${id}`);
    return data;
  },

  async create(dto: CreateFinancialTransactionDto): Promise<FinancialTransaction> {
    const { data } = await axiosInstance.post<FinancialTransaction>(BASE_URL, dto);
    return data;
  },

  async update(id: string, dto: UpdateFinancialTransactionDto): Promise<FinancialTransaction> {
    const { data } = await axiosInstance.patch<FinancialTransaction>(`${BASE_URL}/${id}`, dto);
    return data;
  },

  async markPaid(id: string): Promise<FinancialTransaction> {
    const { data } = await axiosInstance.patch<FinancialTransaction>(`${BASE_URL}/${id}/mark-paid`);
    return data;
  },

  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
};
