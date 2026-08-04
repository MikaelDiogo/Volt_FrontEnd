export interface CalendarOrder {
  id: string;
  customerId: string | null;
  customerName: string;
  deviceCategory: string;
  deviceIdentifier: string;
  deviceModel: string;
  reportedIssue: string;
  status: string;
  technicalReport: string | null;
  createdAt: string;
  estimatedDeliveryDate: string | null;
  protocolNumber: string | null;
  estimatedCost: number;
}
