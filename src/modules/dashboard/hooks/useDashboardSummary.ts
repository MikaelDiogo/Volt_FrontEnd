import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: () => dashboardService.getMetrics(),
    staleTime: 0,
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
  });
}

export function useRevenueSeries() {
  return useQuery({
    queryKey: ["dashboard", "revenue-series"],
    queryFn: () => dashboardService.getRevenueSeries(),
    staleTime: 0,
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
  });
}
