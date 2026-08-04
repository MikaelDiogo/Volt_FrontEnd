export type StockMovementType = "IN" | "OUT";

/**
 * Maps to the backend `product_stock_movements` table: every purchase
 * (restock, type=IN) or usage (consumption in a repair, type=OUT) of a
 * product is logged as one movement row.
 */
export interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason: string | null;
  createdAt: string;
}

export interface CreateStockMovementDto {
  type: StockMovementType;
  quantity: number;
  reason?: string;
}
