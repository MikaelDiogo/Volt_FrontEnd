import { Paper, Text } from "@mantine/core";

export default function SettingsPage() {
  return (
    <div>
      <Paper p="lg" radius="lg" style={{ backgroundColor: "var(--bg-panel)" }}>
        <Text c="var(--text-muted)">
          Em desenvolvimento. Este módulo cobrirá dados da empresa (razão social, CNPJ, endereço, logo),
          categorias de aparelho (cada uma com checklist técnico padrão e modelo de termo de garantia),
          modelos de termo de garantia, usuários e papéis (admin, atendente, técnico, financeiro) com
          permissões por módulo, e configuração de estoque mínimo por produto (ver seção 6.9 da
          documentação técnica).
        </Text>
      </Paper>
    </div>
  );
}
