export enum DeviceStatus {
  IN_STOCK = "IN_STOCK",
  SOLD = "SOLD",
  IN_REPAIR = "IN_REPAIR",
}

export interface Device {
  id: string;
  uniqueIdentifier: string; // IMEI or serial number
  model: string;
  deviceCategoryId: string;
  categoryName: string;
  status: DeviceStatus;
  customerId: string | null;
}

export interface CreateDeviceDto {
  uniqueIdentifier?: string;
  model: string;
  deviceCategoryId: string;
  status: DeviceStatus;
}

export interface UpdateDeviceDto {
  model?: string;
  status?: DeviceStatus;
}

export interface ListDevicesParams {
  page: number;
  perPage: number;
  search?: string;
}
