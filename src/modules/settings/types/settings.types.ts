export interface CompanySettings {
  legalName: string;
  document: string;
  address: string;
  logoUrl: string | null;
}

export interface TelegramLinkCode {
  code: string;
  expiresAt: string;
}

export interface WarrantyTerm {
  id: string;
  name: string;
  deviceCategoryId: string;
  defaultDurationDays: number;
  text: string;
}
