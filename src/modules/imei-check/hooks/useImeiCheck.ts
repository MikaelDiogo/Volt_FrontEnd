import { useMutation } from "@tanstack/react-query";
import { imeiCheckService } from "../services/imei-check.service";

export function useImeiCheck() {
  return useMutation({
    mutationFn: (imei: string) => imeiCheckService.check(imei),
  });
}
