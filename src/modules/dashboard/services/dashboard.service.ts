import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { DashboardMetrics, RevenueSeriesPoint } from "../types/dashboard.types";

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const { data } = await axiosInstance.get<DashboardMetrics>("/dashboard/metrics");
    return data;
  },
  async getRevenueSeries(): Promise<RevenueSeriesPoint[]> {
    const { data } = await axiosInstance.get<RevenueSeriesPoint[]>("/dashboard/revenue-series");
    return data;
  },
};
