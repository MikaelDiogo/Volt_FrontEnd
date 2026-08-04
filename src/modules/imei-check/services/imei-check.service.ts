import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { ImeiCheckLog } from "../types/imei-check.types";

export const imeiCheckService = {
  async check(imei: string): Promise<ImeiCheckLog> {
    const { data } = await axiosInstance.post<ImeiCheckLog>("/imei-check", { imei });
    return data;
  },
};
