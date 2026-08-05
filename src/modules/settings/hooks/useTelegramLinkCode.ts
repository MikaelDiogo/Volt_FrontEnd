import { useMutation } from "@tanstack/react-query";
import { settingsService } from "../services/settings.service";

export function useGenerateTelegramLinkCode() {
  return useMutation({
    mutationFn: () => settingsService.generateTelegramLinkCode(),
  });
}
