import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Center, Stack } from "@mantine/core";
import { PageSkeleton } from "@/shared/components/PageSkeleton";
import { Logo } from "@/shared/components/Logo";

export function AuthLayout() {
  return (
    <Center
      h="100vh"
      style={{
        backgroundColor: "var(--bg)",
        backgroundImage:
          "radial-gradient(circle at top, rgba(76,125,255,0.06), transparent 55%), radial-gradient(circle at top, #12140f, #0b0d0c)",
      }}
    >
      <Stack align="center" gap="xl" w={380}>
        <Logo height={48} />
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </Stack>
    </Center>
  );
}
