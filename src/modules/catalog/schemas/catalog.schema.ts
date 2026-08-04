import { z } from "zod";

export const createCatalogItemSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  displayName: z.string().min(1, "Informe o nome de exibição"),
  displayPrice: z.number().positive("Preço deve ser maior que zero"),
  published: z.boolean(),
});

export type CreateCatalogItemSchema = z.infer<typeof createCatalogItemSchema>;
