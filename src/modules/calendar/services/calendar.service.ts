import { axiosInstance } from "@/shared/lib/api/axiosInstance";
import type { CalendarOrder } from "../types/calendar.types";

export const calendarService = {
  async getOrders(): Promise<CalendarOrder[]> {
    const { data } = await axiosInstance.get<CalendarOrder[]>("/service-orders/calendar");
    return data;
  },
};
