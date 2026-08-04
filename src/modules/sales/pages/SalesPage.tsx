import { Paper, Text } from "@mantine/core";

export default function SalesPage() {
  return (
    <div>
      <Paper p="lg" radius="lg" style={{ backgroundColor: "var(--bg-panel)" }}>
        <Text c="var(--text-muted)">
          Em desenvolvimento. Este módulo cobrirá abertura de vendas avulsas e de aparelhos (revenda),
          upgrade/trade-in com cálculo automático de entrada do usado, formas de pagamento (dinheiro,
          cartão, PIX, parcelamento), emissão de recibo em PDF e cálculo automático de lucro por venda
          (ver seção 6.4 da documentação técnica).
        </Text>
      </Paper>
    </div>
  );
}
