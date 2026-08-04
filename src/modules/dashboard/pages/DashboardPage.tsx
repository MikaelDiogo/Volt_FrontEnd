import { SimpleGrid, Group, Text } from "@mantine/core";
import { Panel } from "@/shared/components/Panel";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useDashboardSummary, useRevenueSeries } from "../hooks/useDashboardSummary";
import { useServiceOrdersList } from "@/modules/service-orders/hooks/useServiceOrders";
import { useProductsList } from "@/modules/inventory/hooks/useProducts";
import { formatCurrencyBRL, formatImei } from "@/shared/utils/formatters";

interface KpiConfig {
  label: string;
  value: string;
  trend: string;
  trendTone: "positive" | "negative" | "neutral";
}

function trendColor(tone: KpiConfig["trendTone"]) {
  if (tone === "positive") return "var(--accent)";
  if (tone === "negative") return "var(--danger)";
  return "var(--text-muted)";
}

function KpiCard({ label, value, trend, trendTone }: KpiConfig) {
  return (
    <Panel>
      <Text style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{label}</Text>
      <Text style={{ fontSize: 26, fontWeight: 600, color: "var(--text)", marginTop: 6 }}>{value}</Text>
      <Text style={{ fontSize: 12, color: trendColor(trendTone), marginTop: 6 }}>{trend}</Text>
    </Panel>
  );
}

export default function DashboardPage() {
  const { data } = useDashboardSummary();
  const { data: recentOrders, isLoading: ordersLoading } = useServiceOrdersList(
    { page: 1, perPage: 5 },
    { refetchInterval: 10_000, staleTime: 0 },
  );
  const { data: productsData } = useProductsList(
    { page: 1, perPage: 20 },
    { refetchInterval: 10_000, staleTime: 0 },
  );
  const { data: revenueSeries } = useRevenueSeries();

  const kpis: KpiConfig[] = [
    {
      label: "Faturamento do mês",
      value: formatCurrencyBRL(data?.totalRevenueMonth ?? 0),
      trend: "acumulado no mês",
      trendTone: "positive",
    },
    {
      label: "O.S. abertas",
      value: String(data?.totalOpenServiceOrders ?? 0),
      trend: "em andamento",
      trendTone: "neutral",
    },
    {
      label: "Clientes cadastrados",
      value: String(data?.totalCustomers ?? 0),
      trend: "total",
      trendTone: "neutral",
    },
    {
      label: "Peças em baixo estoque",
      value: String(data?.lowStockProducts ?? 0),
      trend: (data?.lowStockProducts ?? 0) > 0 ? "atenção necessária" : "sob controle",
      trendTone: (data?.lowStockProducts ?? 0) > 0 ? "negative" : "positive",
    },
  ];

  const stockAlerts = (productsData?.data ?? [])
    .filter((p) => p.quantity <= p.minStock)
    .slice(0, 6);

  const bars = revenueSeries ?? [];
  const maxBar = Math.max(1, ...bars.map((b) => b.total));
  const firstHalf = bars.slice(0, 7).reduce((sum, b) => sum + b.total, 0);
  const secondHalf = bars.slice(7).reduce((sum, b) => sum + b.total, 0);
  const trendPct = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : secondHalf > 0 ? 100 : 0;

  return (
    <div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </SimpleGrid>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 16,
          marginTop: 16,
        }}
      >
        <Panel>
          <Group justify="space-between" mb={12}>
            <Text style={{ fontSize: 14, fontWeight: 600 }}>Faturamento — últimos 14 dias</Text>
            <Text
              style={{
                fontSize: 11.5,
                fontFamily: "var(--font-mono)",
                color: trendPct >= 0 ? "var(--accent)" : "var(--danger)",
              }}
            >
              {trendPct >= 0 ? "+" : ""}
              {trendPct.toFixed(1).replace(".", ",")}%
            </Text>
          </Group>
          {bars.length === 0 ? (
            <Text style={{ fontSize: 13, color: "var(--text-muted)" }}>Sem dados de faturamento ainda.</Text>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140 }}>
              {bars.map((point, index) => {
                const isLast = index === bars.length - 1;
                const heightPct = point.total > 0 ? (point.total / maxBar) * 100 : 2;
                return (
                  <div
                    key={point.date}
                    title={`${point.date}: ${formatCurrencyBRL(point.total)}`}
                    style={{
                      flex: 1,
                      height: `${heightPct}%`,
                      backgroundColor: isLast ? "var(--accent)" : "rgba(76,125,255,0.28)",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                );
              })}
            </div>
          )}
        </Panel>

        <Panel>
          <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Alertas de estoque</Text>
          <div>
            {stockAlerts.length === 0 ? (
              <Text style={{ fontSize: 13, color: "var(--text-muted)" }}>Nenhum alerta de estoque no momento.</Text>
            ) : (
              stockAlerts.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom:
                      index === stockAlerts.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div>
                    <Text style={{ fontSize: 13, fontWeight: 500 }}>{product.name}</Text>
                    <Text style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{product.categoryName}</Text>
                  </div>
                  <Text style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--danger)" }}>
                    {product.quantity} un.
                  </Text>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>

      <Panel style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Últimas Ordens de Serviço</Text>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "90px 1.4fr 1fr 1fr 140px 110px",
            gap: 8,
            fontSize: 11.5,
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted-dark)",
            paddingBottom: 8,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span>Nº O.S.</span>
          <span>CLIENTE / APARELHO</span>
          <span>CATEGORIA</span>
          <span>IDENTIFICADOR</span>
          <span>STATUS</span>
          <span>VALOR</span>
        </div>

        {ordersLoading ? (
          <Text style={{ fontSize: 13, color: "var(--text-muted)", padding: "12px 0" }}>Carregando...</Text>
        ) : (recentOrders?.data ?? []).length === 0 ? (
          <Text style={{ fontSize: 13, color: "var(--text-muted)", padding: "12px 0" }}>
            Nenhuma ordem de serviço encontrada.
          </Text>
        ) : (
          (recentOrders?.data ?? []).map((order, index, arr) => (
            <div
              key={order.id}
              style={{
                display: "grid",
                gridTemplateColumns: "90px 1.4fr 1fr 1fr 140px 110px",
                gap: 8,
                alignItems: "center",
                padding: "12px 0",
                borderBottom: index === arr.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Text style={{ fontSize: 12, fontFamily: "var(--font-mono)" }} truncate>
                {order.protocolNumber ?? `#${order.id.slice(0, 6).toUpperCase()}`}
              </Text>
              <div>
                <Text style={{ fontSize: 13, fontWeight: 500 }}>{order.customerName}</Text>
                <Text style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{order.deviceModel}</Text>
              </div>
              <Text style={{ fontSize: 13 }}>{order.deviceCategory}</Text>
              <Text style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>
                {formatImei(order.deviceIdentifier)}
              </Text>
              <StatusBadge status={order.status} />
              <Text style={{ fontSize: 12.5, fontFamily: "var(--font-mono)" }}>
                {formatCurrencyBRL(order.estimatedCost ?? 0)}
              </Text>
            </div>
          ))
        )}
      </Panel>
    </div>
  );
}
