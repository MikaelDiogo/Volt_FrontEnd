import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { devicesService } from "../services/devices.service";
import type { CreateDeviceDto, UpdateDeviceDto, ListDevicesParams } from "../types/device.types";

const QUERY_KEY = "devices";

export function useDevicesList(params: ListDevicesParams) {
  return useQuery({
    queryKey: [QUERY_KEY, "list", params],
    queryFn: () => devicesService.list(params),
  });
}

export function useDeviceDetail(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, "detail", id],
    queryFn: () => devicesService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDeviceDto) => devicesService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] }),
  });
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDeviceDto }) => devicesService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] }),
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => devicesService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] }),
  });
}
