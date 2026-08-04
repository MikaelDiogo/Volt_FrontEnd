export interface Sale {
  id: string;
  customerName: string;
  total: number;
  paymentMethod: "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "INSTALLMENTS";
  createdAt: string;
}
