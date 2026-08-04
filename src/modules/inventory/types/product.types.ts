export interface Product {
  id: string;
  name: string;
  categoryName: string;
  deviceCategoryId: string | null;
  quantity: number;
  minStock: number;
  costPrice: number | null;
  salePrice: number | null;
}

export interface CreateProductDto {
  name: string;
  deviceCategoryId?: string;
  minStock?: number;
  costPrice?: number;
  salePrice?: number;
}

export interface UpdateProductDto {
  name?: string;
  minStock?: number;
  costPrice?: number;
  salePrice?: number;
}

export interface ListProductsParams {
  page: number;
  perPage: number;
  search?: string;
}
