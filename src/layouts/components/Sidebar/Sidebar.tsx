import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Stack, Box, Text, UnstyledButton, Group, ActionIcon } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { NAV_ITEMS } from "@/app/routes/routes.config";
import { useUiStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { Logo } from "@/shared/components/Logo";

export function Sidebar() {
  const location = useLocation();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);

  const groups = NAV_ITEMS.reduce<Record<string, typeof NAV_ITEMS[number][]>>((acc, item) => {
    const group = "group" in item ? item.group : "OPERAÇÃO";
    (acc[group] ??= []).push(item);
    return acc;
  }, {});

  return (
    <Stack
      h="100%"
      justify="space-between"
      gap={0}
      style={{
        flex: "none",
        width: collapsed ? 76 : 252,
        backgroundColor: "var(--bg-sidebar, #0f110d)",
        borderRight: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
        padding: "20px 14px",
        transition: "width 150ms ease",
        overflow: "hidden",
      }}
    >
      <Stack gap={4} style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }} className="rn-scrollbar">
        <ActionIcon
          variant="subtle"
          color="accent"
          onClick={toggleSidebar}
          aria-label="Alternar menu"
          style={{ marginLeft: 8, marginBottom: 4 }}
        >
          <IconMenu2 size={18} />
        </ActionIcon>

        <Group justify="center" wrap="nowrap" style={{ padding: "10px 4px 26px", minHeight: 44 }}>
          <Logo height={collapsed ? 34 : 52} variant={collapsed ? "mark" : "full"} />
        </Group>

        {Object.entries(groups).map(([group, items]) => (
          <Stack key={group} gap={4} mb={12}>
            {!collapsed && (
              <Text
                ff="var(--font-mono)"
                fw={500}
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted-dark)",
                  padding: "6px 10px",
                }}
              >
                {group}
              </Text>
            )}
            {items.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <UnstyledButton
                  key={item.path}
                  component={RouterNavLink}
                  to={item.path}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px",
                    borderRadius: 9,
                    fontSize: "13.5px",
                    cursor: "pointer",
                    color: isActive ? "var(--text)" : "var(--text-secondary)",
                    backgroundColor: isActive ? "rgba(76,125,255,0.1)" : "transparent",
                    borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                    transition: "background-color 120ms ease, color 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.045)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Icon size={18} stroke={1.75} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <Text size="sm" truncate style={{ fontSize: "13.5px" }}>
                      {item.label}
                    </Text>
                  )}
                </UnstyledButton>
              );
            })}
          </Stack>
        ))}
      </Stack>

      <Group
        gap={10}
        wrap="nowrap"
        style={{
          padding: "12px 10px",
          borderTop: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
          marginTop: "auto",
        }}
      >
        <Box
          style={{
            width: 30,
            height: 30,
            minWidth: 30,
            borderRadius: 8,
            backgroundColor: "#1b1f19",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
        >
          {user?.name?.slice(0, 1).toUpperCase() ?? "?"}
        </Box>
        {!collapsed && (
          <Stack gap={0}>
            <Text fw={600} style={{ fontSize: "12.5px", color: "var(--text)" }}>
              {user?.name ?? "Convidado"}
            </Text>
            <Text style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {user?.role ?? "Usuário"}
            </Text>
          </Stack>
        )}
      </Group>
    </Stack>
  );
}
