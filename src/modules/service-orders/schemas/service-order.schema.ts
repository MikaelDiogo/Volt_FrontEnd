import { z } from "zod";

export const checklistItemSchema = z.object({
  item: z.string().min(1),
  checked: z.boolean(),
});

export const createServiceOrderSchema = z.object({
  deviceId: z.string().min(1, "Selecione o aparelho"),
  reportedIssue: z.string().min(3, "Descreva o defeito relatado"),
  checklist: z.array(checklistItemSchema).default([]),
  estimatedDeliveryDate: z.string().optional(),
  estimatedCost: z.number().optional(),
  recipientName: z.string().min(1, "Informe o nome de quem vai retirar o aparelho"),
  recipientPhone: z.string().min(8, "Informe um telefone para contato"),
});

export type CreateServiceOrderSchema = z.infer<typeof createServiceOrderSchema>;

export const updateServiceOrderSchema = z.object({
  status: z
    .enum(["PENDING", "IN_REPAIR", "READY", "DELIVERED", "CANCELLED"])
    .optional(),
  technicalReport: z.string().optional(),
  checklist: z.array(z.object({ label: z.string().min(1), checked: z.boolean() })).optional(),
});

export type UpdateServiceOrderSchema = z.infer<typeof updateServiceOrderSchema>;
