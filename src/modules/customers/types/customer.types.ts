export interface Customer {
  id: string;
  name: string;
  document: string | null; // CPF/CNPJ
  phone: string | null;
  email: string | null;
  createdAt: string;
}

export interface CreateCustomerDto {
  name: string;
  document?: string;
  phone?: string;
  email?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  document?: string;
  phone?: string;
  email?: string;
}

export interface ListCustomersParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface CustomerServiceOrderSummary {
  id: string;
  deviceModel: string;
  status: string;
  createdAt: string;
}
