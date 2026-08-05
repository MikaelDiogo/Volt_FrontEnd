import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { CompanySettings, TelegramLinkCode } from "../types/settings.types";

export const settingsService = {
  async getCompanySettings(): Promise<CompanySettings> {
    const { data } = await axiosInstance.get<CompanySettings>("/settings/company");
    return data;
  },

  async generateTelegramLinkCode(): Promise<TelegramLinkCode> {
    const { data } = await axiosInstance.post<TelegramLinkCode>("/companies/me/telegram-link-code");
    return data;
  },
};
