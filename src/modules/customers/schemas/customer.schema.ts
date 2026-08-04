import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2, "Informe o nome completo"),
  document: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
});

export type CreateCustomerSchema = z.infer<typeof createCustomerSchema>;
