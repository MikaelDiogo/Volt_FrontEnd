import { z } from "zod";

export const createDeviceCategorySchema = z.object({
  name: z.string().min(1, "Informe o nome da categoria"),
  hasImei: z.boolean(),
  defaultChecklist: z.array(z.string()).default([]),
});

export type CreateDeviceCategorySchema = z.infer<typeof createDeviceCategorySchema>;
