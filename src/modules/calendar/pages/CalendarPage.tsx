import { Calendar } from "@mantine/dates";
import { Text, HoverCard, Indicator, Stack, Group } from "@mantine/core";
import { Panel } from "@/shared/components/Panel";
import { ServiceOrderStatusBadge } from "@/modules/service-orders/components/ServiceOrderStatusBadge";
import { useCalendarOrders } from "../hooks/useCalendarOrders";
import { formatCurrencyBRL, formatImei } from "@/shared/utils/formatters";
import type { CalendarOrder } from "../types/calendar.types";
import type { ServiceOrderStatus } from "@/modules/service-orders/types/service-order.types";

function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatBR(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function OrderSummary({ order }: { order: CalendarOrder }) {
  return (
    <Stack gap={4}>
      <Group justify="space-between" wrap="nowrap">
        <Text fw={600} style={{ fontSize: 13 }}>
          {order.protocolNumber ?? `#${order.id.slice(0, 6).toUpperCase()}`}
        </Text>
        <ServiceOrderStatusBadge status={order.status as ServiceOrderStatus} />
      </Group>
      <Text style={{ fontSize: 13 }}>
        <b>Cliente:</b> {order.customerName}
      </Text>
      <Text style={{ fontSize: 13 }}>
        <b>Aparelho:</b> {order.deviceModel} ({order.deviceCategory})
      </Text>
      <Text style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
        {formatImei(order.deviceIdentifier)}
      </Text>
      <Text style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{order.reportedIssue}</Text>
      <Text style={{ fontSize: 12.5, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
        {formatCurrencyBRL(order.estimatedCost)}
      </Text>
    </Stack>
  );
}

export default function CalendarPage() {
  const { data: orders, isLoading } = useCalendarOrders();

  const ordersByDate = new Map<string, CalendarOrder[]>();
  for (const order of orders ?? []) {
    if (!order.estimatedDeliveryDate) continue;
    const list = ordersByDate.get(order.estimatedDeliveryDate) ?? [];
    list.push(order);
    ordersByDate.set(order.estimatedDeliveryDate, list);
  }

  const today = dateKey(new Date());
  const upcoming = (orders ?? [])
    .filter((o) => o.estimatedDeliveryDate && o.estimatedDeliveryDate >= today)
    .sort((a, b) => (a.estimatedDeliveryDate! < b.estimatedDeliveryDate! ? -1 : 1));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Panel>
        <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
          Calendário de entregas
        </Text>
        <Calendar
          size="md"
          firstDayOfWeek={0}
          renderDay={(date) => {
            const jsDate = date instanceof Date ? date : new Date(date as unknown as string);
            const key = dateKey(jsDate);
            const dayOrders = ordersByDate.get(key) ?? [];
            const day = jsDate.getDate();

            if (dayOrders.length === 0) {
              return <div>{day}</div>;
            }

            return (
              <HoverCard width={280} shadow="md" position="top" withArrow openDelay={120}>
                <HoverCard.Target>
                  <Indicator size={7} color="accent" offset={-2}>
                    <div>{day}</div>
                  </Indicator>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Stack gap={10}>
                    {dayOrders.map((order, index) => (
                      <div key={order.id}>
                        {index > 0 && (
                          <div
                            style={{
                              borderTop: "1px solid var(--border-subtle)",
                              margin: "8px 0",
                            }}
                          />
                        )}
                        <OrderSummary order={order} />
                      </div>
                    ))}
                  </Stack>
                </HoverCard.Dropdown>
              </HoverCard>
            );
          }}
        />
      </Panel>

      <Panel>
        <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
          Próximas entregas
        </Text>
        {isLoading ? (
          <Text style={{ fontSize: 13, color: "var(--text-muted)" }}>Carregando...</Text>
        ) : upcoming.length === 0 ? (
          <Text style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Nenhuma entrega prevista.
          </Text>
        ) : (
          <Stack gap={0}>
            {upcoming.map((order, index) => (
              <div
                key={order.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom:
                    index === upcoming.length - 1 ? "none" : "1px solid var(--border-subtle)",
                }}
              >
                <div>
                  <Text style={{ fontSize: 13, fontWeight: 500 }}>{order.deviceModel}</Text>
                  <Text style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                    {order.customerName}
                  </Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      color: "var(--accent)",
                    }}
                  >
                    {formatBR(order.estimatedDeliveryDate!)}
                  </Text>
                  <ServiceOrderStatusBadge status={order.status as ServiceOrderStatus} />
                </div>
              </div>
            ))}
          </Stack>
        )}
      </Panel>
    </div>
  );
}
