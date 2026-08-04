import { z } from "zod";
import { DeviceStatus } from "../types/device.types";

export const createDeviceSchema = z.object({
  uniqueIdentifier: z.string().optional(),
  model: z.string().min(1, "Informe o modelo"),
  deviceCategoryId: z.string().min(1, "Selecione a categoria"),
  status: z.nativeEnum(DeviceStatus),
});

export type CreateDeviceSchema = z.infer<typeof createDeviceSchema>;
