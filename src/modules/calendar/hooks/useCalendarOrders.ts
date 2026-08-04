import { useQuery } from "@tanstack/react-query";
import { calendarService } from "../services/calendar.service";

export function useCalendarOrders() {
  return useQuery({
    queryKey: ["service-orders", "calendar"],
    queryFn: () => calendarService.getOrders(),
  });
}
