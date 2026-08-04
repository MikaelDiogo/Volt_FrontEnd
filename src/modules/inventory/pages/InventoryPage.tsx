import { Tabs, SimpleGrid, Text } from "@mantine/core";
import { Panel } from "@/shared/components/Panel";
import { DevicesTab } from "../components/DevicesTab";
import { CategoriesTab } from "../components/CategoriesTab";
import { ProductsTab } from "../components/ProductsTab";
import { StockMovementsPanel } from "../components/StockMovementsPanel";
import { useDevicesList } from "../hooks/useDevices";
import { useProductsList } from "../hooks/useProducts";
import { formatCurrencyBRL } from "@/shared/utils/formatters";

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Panel>
      <Text style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{label}</Text>
      <Text style={{ fontSize: 24, fontWeight: 600, color: "var(--text)", marginTop: 6 }}>{value}</Text>
    </Panel>
  );
}

export default function InventoryPage() {
  const { data: devicesData } = useDevicesList({ page: 1, perPage: 1 });
  const { data: productsData } = useProductsList({ page: 1, perPage: 100 });

  const products = productsData?.data ?? [];
  const belowMinStock = products.filter((p) => p.quantity <= p.minStock).length;
  const totalStockValue = products.reduce((sum, p) => sum + p.quantity * (p.costPrice ?? 0), 0);

  return (
    <div>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="md">
        <KpiCard label="Aparelhos em estoque" value={String(devicesData?.meta.total ?? 0)} />
        <KpiCard label="Peças abaixo do mínimo" value={String(belowMinStock)} />
        <KpiCard label="Valor total em estoque" value={formatCurrencyBRL(totalStockValue)} />
      </SimpleGrid>

      <Tabs defaultValue="devices" color="accent">
        <Tabs.List mb="md">
          <Tabs.Tab value="devices">Aparelhos</Tabs.Tab>
          <Tabs.Tab value="categories">Categorias</Tabs.Tab>
          <Tabs.Tab value="products">Produtos</Tabs.Tab>
          <Tabs.Tab value="movements">Movimentação de Peças</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="devices">
          <DevicesTab />
        </Tabs.Panel>
        <Tabs.Panel value="categories">
          <CategoriesTab />
        </Tabs.Panel>
        <Tabs.Panel value="products">
          <ProductsTab />
        </Tabs.Panel>
        <Tabs.Panel value="movements">
          <StockMovementsPanel />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
