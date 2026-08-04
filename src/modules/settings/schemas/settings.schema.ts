import { z } from "zod";

export const companySettingsSchema = z.object({
  legalName: z.string().min(1, "Informe a razão social"),
  document: z.string().min(1, "Informe o CNPJ"),
  address: z.string().optional().or(z.literal("")),
});

export type CompanySettingsSchema = z.infer<typeof companySettingsSchema>;
