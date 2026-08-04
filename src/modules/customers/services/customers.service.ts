import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  ListCustomersParams,
  CustomerServiceOrderSummary,
} from "../types/customer.types";

const BASE_URL = "/customers";

export const customersService = {
  async list(params: ListCustomersParams): Promise<PaginatedResponse<Customer>> {
    const { data } = await axiosInstance.get<PaginatedResponse<Customer>>(BASE_URL, { params });
    return data;
  },
  async get(id: string): Promise<Customer> {
    const { data } = await axiosInstance.get<Customer>(`${BASE_URL}/${id}`);
    return data;
  },
  async create(dto: CreateCustomerDto): Promise<Customer> {
    const { data } = await axiosInstance.post<Customer>(BASE_URL, dto);
    return data;
  },
  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const { data } = await axiosInstance.patch<Customer>(`${BASE_URL}/${id}`, dto);
    return data;
  },
  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
  async listServiceOrders(id: string): Promise<CustomerServiceOrderSummary[]> {
    const { data } = await axiosInstance.get<CustomerServiceOrderSummary[]>(
      `${BASE_URL}/${id}/service-orders`,
    );
    return data;
  },
};
