export interface DeviceCategory {
  id: string;
  name: string;
  hasImei: boolean;
  defaultChecklist: string[];
}

export interface CreateDeviceCategoryDto {
  name: string;
  hasImei: boolean;
  defaultChecklist: string[];
}

export interface UpdateDeviceCategoryDto {
  name?: string;
  hasImei?: boolean;
  defaultChecklist?: string[];
}

export interface ListDeviceCategoriesParams {
  page: number;
  perPage: number;
  search?: string;
}
