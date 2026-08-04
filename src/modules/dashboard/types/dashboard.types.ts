export interface DashboardMetrics {
  totalOpenServiceOrders: number;
  totalRevenueMonth: number;
  totalCustomers: number;
  lowStockProducts: number;
}

export interface RevenueSeriesPoint {
  date: string;
  total: number;
}
