import { z } from "zod";

export const createSaleSchema = z.object({
  customerId: z.string().min(1, "Selecione um cliente"),
  paymentMethod: z.enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX", "INSTALLMENTS"]),
});

export type CreateSaleSchema = z.infer<typeof createSaleSchema>;
