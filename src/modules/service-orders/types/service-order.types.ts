export enum ServiceOrderStatus {
  PENDING = "PENDING",
  IN_REPAIR = "IN_REPAIR",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface ChecklistItem {
  label: string;
  checked: boolean;
}

export interface ServiceOrder {
  id: string;
  customerId: string | null;
  customerName: string;
  deviceCategory: string;
  deviceIdentifier: string; // IMEI or serial number
  deviceModel: string;
  reportedIssue: string;
  checklist: ChecklistItem[];
  status: ServiceOrderStatus;
  technicalReport: string | null;
  createdAt: string;
  protocolNumber: string | null;
  estimatedDeliveryDate: string | null;
  /** Estimated/quoted repair value ("Valor" column in the O.S. tables). */
  estimatedCost: number;
  recipientName: string | null;
  recipientPhone: string | null;
  internalNotes: string | null;
}

export interface CreateServiceOrderDto {
  deviceId: string;
  reportedIssue: string;
  checklist: { item: string; checked: boolean }[];
  estimatedDeliveryDate?: string;
  estimatedCost?: number;
  recipientName?: string;
  recipientPhone?: string;
}

export interface UpdateServiceOrderDto {
  status?: ServiceOrderStatus;
  technicalReport?: string;
  checklist?: ChecklistItem[];
  internalNotes?: string;
}

export interface ListServiceOrdersParams {
  page: number;
  perPage: number;
  status?: ServiceOrderStatus;
  search?: string;
}
