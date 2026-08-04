import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type {
  DeviceCategory,
  CreateDeviceCategoryDto,
  UpdateDeviceCategoryDto,
} from "../types/device-category.types";

const BASE_URL = "/inventory/device-categories";

export const deviceCategoriesService = {
  async list(): Promise<DeviceCategory[]> {
    const { data } = await axiosInstance.get<DeviceCategory[]>(BASE_URL);
    return data;
  },
  async get(id: string): Promise<DeviceCategory> {
    const { data } = await axiosInstance.get<DeviceCategory>(`${BASE_URL}/${id}`);
    return data;
  },
  async create(dto: CreateDeviceCategoryDto): Promise<DeviceCategory> {
    const { data } = await axiosInstance.post<DeviceCategory>(BASE_URL, dto);
    return data;
  },
  async update(id: string, dto: UpdateDeviceCategoryDto): Promise<DeviceCategory> {
    const { data } = await axiosInstance.patch<DeviceCategory>(`${BASE_URL}/${id}`, dto);
    return data;
  },
  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
};
