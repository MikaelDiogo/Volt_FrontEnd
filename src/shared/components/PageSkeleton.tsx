import { Skeleton, Stack } from "@mantine/core";

export function PageSkeleton() {
  return (
    <Stack gap="md" p="md">
      <Skeleton height={32} width="30%" radius="sm" />
      <Skeleton height={220} radius="lg" />
      <Skeleton height={220} radius="lg" />
    </Stack>
  );
}
