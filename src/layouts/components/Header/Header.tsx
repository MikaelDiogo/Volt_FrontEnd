import { Link } from "react-router-dom";
import { Group, Text, Avatar, Menu, UnstyledButton, Box, Switch, useMantineColorScheme } from "@mantine/core";
import { IconSearch, IconSun, IconMoon } from "@tabler/icons-react";
import { useAuthStore } from "@/stores/auth.store";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";
import { NotificationsMenu } from "./NotificationsMenu";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group
      h={64}
      wrap="nowrap"
      justify="space-between"
      style={{
        flex: "none",
        backgroundColor: "var(--bg)",
        padding: "0 28px",
      }}
    >
      <Breadcrumbs />

      <Group gap={14} wrap="nowrap">
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "var(--bg-panel)",
            border: "1px solid var(--border-input, rgba(255,255,255,0.08))",
            borderRadius: 8,
            padding: "8px 14px",
            width: 260,
          }}
        >
          <IconSearch size={14} style={{ color: "var(--text-muted-dark)", flexShrink: 0 }} />
          <Text
            style={{
              fontSize: "13px",
              color: "var(--text-muted-dark)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Buscar O.S., cliente, IMEI...
          </Text>
        </Box>

        <Switch
          size="md"
          color="accent"
          checked={colorScheme === "light"}
          onChange={toggleColorScheme}
          onLabel={<IconSun size={13} stroke={2} />}
          offLabel={<IconMoon size={13} stroke={2} />}
          aria-label="Alternar tema claro/escuro"
        />

        <NotificationsMenu />

        <UnstyledButton
          component={Link}
          to="/ordens-servico"
          style={{
            backgroundColor: "var(--accent)",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "13px",
            padding: "9px 16px",
            borderRadius: 8,
          }}
        >
          + Nova O.S.
        </UnstyledButton>

        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <UnstyledButton>
              <Group gap="xs" wrap="nowrap">
                <Avatar color="accent" radius="xl" size="sm">
                  {user?.name?.slice(0, 1).toUpperCase() ?? "?"}
                </Avatar>
                <Text size="sm" c="var(--text-secondary)">
                  {user?.name ?? "Convidado"}
                </Text>
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={logout} color="danger">
              Sair
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
