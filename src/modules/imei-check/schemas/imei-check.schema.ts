import { z } from "zod";

export const imeiCheckSchema = z.object({
  imei: z
    .string()
    .refine((value) => value.replace(/\D/g, "").length === 15, "IMEI deve ter 15 dígitos"),
});

export type ImeiCheckSchema = z.infer<typeof imeiCheckSchema>;
