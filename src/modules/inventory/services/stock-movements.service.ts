import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { CreateStockMovementDto, StockMovement } from "../types/stock-movement.types";

const BASE_URL = "/inventory/products";

export const stockMovementsService = {
  async list(productId: string): Promise<StockMovement[]> {
    const { data } = await axiosInstance.get<StockMovement[]>(`${BASE_URL}/${productId}/stock-movements`);
    return data;
  },
  async create(productId: string, dto: CreateStockMovementDto): Promise<StockMovement> {
    const { data } = await axiosInstance.post<StockMovement>(
      `${BASE_URL}/${productId}/stock-movements`,
      dto,
    );
    return data;
  },
};
