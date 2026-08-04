import { z } from "zod";

export const dashboardFiltersSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export type DashboardFiltersSchema = z.infer<typeof dashboardFiltersSchema>;
