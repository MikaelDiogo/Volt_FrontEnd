export type FinancialTransactionType = "payable" | "receivable";

export interface FinancialTransaction {
  id: string;
  type: FinancialTransactionType;
  amount: number;
  dueDate: string | null;
  paidAt: string | null;
  saleId: string | null;
  serviceOrderId: string | null;
  createdAt: string;
}

export interface CreateFinancialTransactionDto {
  type: FinancialTransactionType;
  amount: number;
  dueDate?: string;
  saleId?: string;
  serviceOrderId?: string;
}

export type UpdateFinancialTransactionDto = Partial<CreateFinancialTransactionDto>;

export interface ListFinancialTransactionsParams {
  page: number;
  perPage: number;
}
