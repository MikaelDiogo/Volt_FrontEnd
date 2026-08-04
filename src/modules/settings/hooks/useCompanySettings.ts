import { useQuery } from "@tanstack/react-query";
import { settingsService } from "../services/settings.service";

export function useCompanySettings() {
  return useQuery({
    queryKey: ["settings", "company"],
    queryFn: () => settingsService.getCompanySettings(),
  });
}
