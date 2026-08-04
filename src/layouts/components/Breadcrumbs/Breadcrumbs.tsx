import { useLocation, Link } from "react-router-dom";
import { Anchor, Group, Text } from "@mantine/core";
import { NAV_ITEMS } from "@/app/routes/routes.config";

export function Breadcrumbs() {
  const location = useLocation();
  const current = NAV_ITEMS.find((item) =>
    item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path),
  );

  return (
    <div>
      <Group gap={6} wrap="nowrap">
        <Anchor
          component={Link}
          to="/"
          underline="never"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-muted-dark)",
          }}
        >
          rn.ninja
        </Anchor>
        <Text style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted-dark)" }}>
          /
        </Text>
        <Text style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted-dark)" }}>
          {current?.label ?? ""}
        </Text>
      </Group>
      <Text
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "19px",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--text)",
        }}
      >
        {current?.label ?? ""}
      </Text>
    </div>
  );
}
