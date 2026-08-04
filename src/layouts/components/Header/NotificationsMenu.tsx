import { Popover, Box, Text, Stack, ScrollArea, Indicator } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useCalendarOrders } from "@/modules/calendar/hooks/useCalendarOrders";
import { ServiceOrderStatus } from "@/modules/service-orders/types/service-order.types";

function daysUntil(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function urgencyLabel(days: number): { text: string; color: string } {
  if (days < 0) return { text: `Atrasada há ${Math.abs(days)} dia${Math.abs(days) === 1 ? "" : "s"}`, color: "var(--danger)" };
  if (days === 0) return { text: "Entrega hoje", color: "var(--warning)" };
  if (days === 1) return { text: "Entrega amanhã", color: "var(--warning)" };
  return { text: `Faltam ${days} dias`, color: "var(--accent)" };
}

export function NotificationsMenu() {
  const { data: orders } = useCalendarOrders();

  const pending = (orders ?? [])
    .filter(
      (o) =>
        o.estimatedDeliveryDate &&
        o.status !== ServiceOrderStatus.DELIVERED &&
        o.status !== ServiceOrderStatus.CANCELLED,
    )
    .map((o) => ({ ...o, days: daysUntil(o.estimatedDeliveryDate!) }))
    .sort((a, b) => a.days - b.days);

  return (
    <Popover width={320} shadow="md" position="bottom-end" withArrow>
      <Popover.Target>
        <Box
          style={{
            position: "relative",
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: "var(--bg-panel)",
            border: "1px solid var(--border-input, rgba(255,255,255,0.08))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          aria-label="Notificações"
        >
          <IconBell size={16} style={{ color: "var(--text-secondary)" }} />
          {pending.length > 0 && (
            <Box
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--accent)",
              }}
            />
          )}
        </Box>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Text style={{ fontSize: 13, fontWeight: 600, padding: "12px 14px" }}>
          Prazos de entrega
        </Text>
        <ScrollArea.Autosize mah={360}>
          <Stack gap={0}>
            {pending.length === 0 ? (
              <Text style={{ fontSize: 13, color: "var(--text-muted)", padding: "0 14px 14px" }}>
                Nenhuma O.S. com entrega prevista.
              </Text>
            ) : (
              pending.map((order, index) => {
                const urgency = urgencyLabel(order.days);
                return (
                  <Box
                    key={order.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      borderTop: index === 0 ? "1px solid var(--border-subtle)" : "none",
                      borderBottom:
                        index === pending.length - 1 ? "none" : "1px solid var(--border-subtle)",
                    }}
                  >
                    <Indicator size={7} color={urgency.color} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontSize: 13, fontWeight: 500 }} truncate>
                        {order.deviceModel} — {order.customerName}
                      </Text>
                      <Text style={{ fontSize: 11.5, color: urgency.color }}>{urgency.text}</Text>
                    </div>
                  </Box>
                );
              })
            )}
          </Stack>
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
}
