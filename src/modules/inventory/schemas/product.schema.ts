import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Informe o nome da peça"),
  deviceCategoryId: z.string().optional(),
  minStock: z.number().min(0, "Estoque mínimo não pode ser negativo"),
  costPrice: z.number().min(0, "Preço de custo inválido").optional(),
  salePrice: z.number().min(0, "Preço de venda inválido").optional(),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
