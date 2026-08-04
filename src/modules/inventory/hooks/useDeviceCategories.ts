import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deviceCategoriesService } from "../services/device-categories.service";
import type { CreateDeviceCategoryDto, UpdateDeviceCategoryDto } from "../types/device-category.types";

const QUERY_KEY = "device-categories";

export function useDeviceCategoriesList() {
  return useQuery({
    queryKey: [QUERY_KEY, "list"],
    queryFn: () => deviceCategoriesService.list(),
  });
}

export function useDeviceCategoryDetail(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, "detail", id],
    queryFn: () => deviceCategoriesService.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateDeviceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDeviceCategoryDto) => deviceCategoriesService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] }),
  });
}

export function useUpdateDeviceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDeviceCategoryDto }) =>
      deviceCategoriesService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] }),
  });
}

export function useDeleteDeviceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deviceCategoriesService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "list"] }),
  });
}
