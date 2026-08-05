import { z } from "zod";

export const createFinancialTransactionSchema = z.object({
  type: z.enum(["payable", "receivable"]),
  amount: z.number().positive("Valor deve ser maior que zero"),
  dueDate: z.string().min(1, "Informe a data de vencimento").optional(),
});

export type CreateFinancialTransactionSchema = z.infer<typeof createFinancialTransactionSchema>;
