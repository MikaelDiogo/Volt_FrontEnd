import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type {
  ServiceOrder,
  CreateServiceOrderDto,
  UpdateServiceOrderDto,
  ListServiceOrdersParams,
} from "../types/service-order.types";

const BASE_URL = "/service-orders";

export const serviceOrdersService = {
  async list(params: ListServiceOrdersParams): Promise<PaginatedResponse<ServiceOrder>> {
    const { data } = await axiosInstance.get<PaginatedResponse<ServiceOrder>>(BASE_URL, { params });
    return data;
  },

  async get(id: string): Promise<ServiceOrder> {
    const { data } = await axiosInstance.get<ServiceOrder>(`${BASE_URL}/${id}`);
    return data;
  },

  async create(dto: CreateServiceOrderDto): Promise<ServiceOrder> {
    const { data } = await axiosInstance.post<ServiceOrder>(BASE_URL, dto);
    return data;
  },

  async update(id: string, dto: UpdateServiceOrderDto): Promise<ServiceOrder> {
    // Status/report/notes are still saved through their own dedicated
    // sub-routes; every other field goes through the generic PATCH /:id.
    let result: ServiceOrder | null = null;

    if (dto.status !== undefined) {
      const { data } = await axiosInstance.patch<ServiceOrder>(`${BASE_URL}/${id}/status`, {
        status: dto.status,
      });
      result = data;
    }

    if (dto.technicalReport !== undefined) {
      const { data } = await axiosInstance.patch<ServiceOrder>(`${BASE_URL}/${id}/report`, {
        technicalReport: dto.technicalReport,
      });
      result = data;
    }

    if (dto.internalNotes !== undefined) {
      const { data } = await axiosInstance.patch<ServiceOrder>(`${BASE_URL}/${id}/notes`, {
        internalNotes: dto.internalNotes,
      });
      result = data;
    }

    const { status, technicalReport, internalNotes, ...rest } = dto;
    if (Object.keys(rest).length > 0) {
      const { data } = await axiosInstance.patch<ServiceOrder>(`${BASE_URL}/${id}`, rest);
      result = data;
    }

    return result ?? this.get(id);
  },

  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
};
