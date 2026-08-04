import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type { Product, CreateProductDto, UpdateProductDto, ListProductsParams } from "../types/product.types";

const BASE_URL = "/inventory/products";

export const productsService = {
  async list(params: ListProductsParams): Promise<PaginatedResponse<Product>> {
    const { data } = await axiosInstance.get<PaginatedResponse<Product>>(BASE_URL, { params });
    return data;
  },
  async get(id: string): Promise<Product> {
    const { data } = await axiosInstance.get<Product>(`${BASE_URL}/${id}`);
    return data;
  },
  async create(dto: CreateProductDto): Promise<Product> {
    const { data } = await axiosInstance.post<Product>(BASE_URL, dto);
    return data;
  },
  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const { data } = await axiosInstance.patch<Product>(`${BASE_URL}/${id}`, dto);
    return data;
  },
  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
};
