import { Paper, Text } from "@mantine/core";

export default function CatalogPage() {
  return (
    <div>
      <Paper p="lg" radius="lg" style={{ backgroundColor: "var(--bg-panel)" }}>
        <Text c="var(--text-muted)">
          Em desenvolvimento. Este módulo permitirá configurar a vitrine virtual (quais produtos do
          estoque aparecem publicamente), upload de fotos e descrição, preço de exibição diferente do
          preço interno, e geração de link público compartilhável — sem integração com tráfego pago (ver
          seção 6.7 da documentação técnica).
        </Text>
      </Paper>
    </div>
  );
}
