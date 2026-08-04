import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type { Device, CreateDeviceDto, UpdateDeviceDto, ListDevicesParams } from "../types/device.types";

const BASE_URL = "/inventory/devices";

export const devicesService = {
  async list(params: ListDevicesParams): Promise<PaginatedResponse<Device>> {
    const { data } = await axiosInstance.get<PaginatedResponse<Device>>(BASE_URL, { params });
    return data;
  },
  async get(id: string): Promise<Device> {
    const { data } = await axiosInstance.get<Device>(`${BASE_URL}/${id}`);
    return data;
  },
  async create(dto: CreateDeviceDto): Promise<Device> {
    const { data } = await axiosInstance.post<Device>(BASE_URL, dto);
    return data;
  },
  async update(id: string, dto: UpdateDeviceDto): Promise<Device> {
    const { data } = await axiosInstance.patch<Device>(`${BASE_URL}/${id}`, dto);
    return data;
  },
  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
};
