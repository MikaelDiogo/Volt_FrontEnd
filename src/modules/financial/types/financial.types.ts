export interface FinancialTransaction {
  id: string;
  description: string;
  type: "PAYABLE" | "RECEIVABLE";
  amount: number;
  dueDate: string;
  paid: boolean;
}
