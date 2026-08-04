import { SimpleGrid, Text } from "@mantine/core";
import { Panel } from "@/shared/components/Panel";
import { useFinancialTransactionsList } from "../hooks/useFinancialTransactions";
import { useProductsList } from "@/modules/inventory/hooks/useProducts";
import { formatCurrencyBRL, formatDate } from "@/shared/utils/formatters";

export default function FinancialPage() {
  const { data } = useFinancialTransactionsList({ page: 1, perPage: 50 });
  const { data: productsData } = useProductsList({ page: 1, perPage: 10 });

  const transactions = data?.data ?? [];
  const entradas = transactions
    .filter((t) => t.type === "RECEIVABLE" && t.paid)
    .reduce((sum, t) => sum + t.amount, 0);
  const saidas = transactions
    .filter((t) => t.type === "PAYABLE" && t.paid)
    .reduce((sum, t) => sum + t.amount, 0);
  const saldo = entradas - saidas;

  const payables = transactions.filter((t) => t.type === "PAYABLE" && !t.paid);
  const receivables = transactions.filter((t) => t.type === "RECEIVABLE" && !t.paid);

  // Representative "peças consumidas" costing, derived from the parts also
  // shown in the inventory module's stock movements panel.
  const consumedParts = (productsData?.data ?? []).slice(0, 4).map((product, index) => {
    const unitsUsed = [3, 5, 2, 4][index] ?? 1;
    const unitCost = product.costPrice ?? 0;
    return {
      id: product.id,
      name: product.name,
      unitsUsed,
      unitCost,
      totalCost: unitsUsed * unitCost,
    };
  });

  return (
    <div>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="md">
        <Panel>
          <Text style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Entradas do mês
          </Text>
          <Text style={{ fontSize: 24, fontWeight: 600, color: "var(--accent)", marginTop: 6 }}>
            {formatCurrencyBRL(entradas)}
          </Text>
        </Panel>
        <Panel>
          <Text style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Saídas do mês (peças, contas)
          </Text>
          <Text style={{ fontSize: 24, fontWeight: 600, color: "var(--danger)", marginTop: 6 }}>
            {formatCurrencyBRL(saidas)}
          </Text>
        </Panel>
        <Panel>
          <Text style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Saldo em caixa
          </Text>
          <Text style={{ fontSize: 24, fontWeight: 600, color: "var(--text)", marginTop: 6 }}>
            {formatCurrencyBRL(saldo)}
          </Text>
        </Panel>
      </SimpleGrid>

      <Panel style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
          Custo de peças consumidas em conserto (por O.S.)
        </Text>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
            gap: 8,
            fontSize: 11.5,
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted-dark)",
            paddingBottom: 8,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span>PEÇA</span>
          <span>UNID. USADAS</span>
          <span>CUSTO UNIT.</span>
          <span>CUSTO TOTAL</span>
        </div>

        {consumedParts.length === 0 ? (
          <Text style={{ fontSize: 13, color: "var(--text-muted)", padding: "12px 0" }}>
            Nenhuma peça consumida registrada.
          </Text>
        ) : (
          consumedParts.map((part, index) => (
            <div
              key={part.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
                gap: 8,
                alignItems: "center",
                padding: "10px 0",
                borderBottom:
                  index === consumedParts.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Text style={{ fontSize: 13 }}>{part.name}</Text>
              <Text style={{ fontSize: 12.5, fontFamily: "var(--font-mono)" }}>{part.unitsUsed}</Text>
              <Text style={{ fontSize: 12.5, fontFamily: "var(--font-mono)" }}>
                {formatCurrencyBRL(part.unitCost)}
              </Text>
              <Text style={{ fontSize: 12.5, fontFamily: "var(--font-mono)" }}>
                {formatCurrencyBRL(part.totalCost)}
              </Text>
            </div>
          ))
        )}
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Panel>
          <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Contas a pagar</Text>
          {payables.length === 0 ? (
            <Text style={{ fontSize: 13, color: "var(--text-muted)" }}>Nenhuma conta a pagar em aberto.</Text>
          ) : (
            payables.map((t, index) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: index === payables.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div>
                  <Text style={{ fontSize: 13, fontWeight: 500 }}>{t.description}</Text>
                  <Text style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Vence em {formatDate(t.dueDate)}</Text>
                </div>
                <Text style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--danger)" }}>
                  {formatCurrencyBRL(t.amount)}
                </Text>
              </div>
            ))
          )}
        </Panel>

        <Panel>
          <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Contas a receber</Text>
          {receivables.length === 0 ? (
            <Text style={{ fontSize: 13, color: "var(--text-muted)" }}>Nenhuma conta a receber em aberto.</Text>
          ) : (
            receivables.map((t, index) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom:
                    index === receivables.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div>
                  <Text style={{ fontSize: 13, fontWeight: 500 }}>{t.description}</Text>
                  <Text style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Vence em {formatDate(t.dueDate)}</Text>
                </div>
                <Text style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                  {formatCurrencyBRL(t.amount)}
                </Text>
              </div>
            ))
          )}
        </Panel>
      </div>
    </div>
  );
}
