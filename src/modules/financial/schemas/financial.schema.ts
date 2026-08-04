import { z } from "zod";

export const createFinancialTransactionSchema = z.object({
  description: z.string().min(1, "Informe a descrição"),
  type: z.enum(["PAYABLE", "RECEIVABLE"]),
  amount: z.number().positive("Valor deve ser maior que zero"),
  dueDate: z.string().min(1, "Informe a data de vencimento"),
});

export type CreateFinancialTransactionSchema = z.infer<typeof createFinancialTransactionSchema>;
