import { Button, Code, Modal, Paper, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useGenerateTelegramLinkCode } from "../hooks/useTelegramLinkCode";

export default function SettingsPage() {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const generateTelegramLinkCode = useGenerateTelegramLinkCode();

  function handleGenerateCode() {
    generateTelegramLinkCode.mutate(undefined, {
      onSuccess: (data) => {
        setLinkCode(data.code);
        openModal();
      },
      onError: (error: unknown) => {
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
          ?? "Não foi possível gerar o código de vínculo do Telegram.";
        notifications.show({ color: "danger", title: "Erro", message: String(message) });
      },
    });
  }

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

      <Paper mt="md" p="lg" radius="lg" style={{ backgroundColor: "var(--bg-panel)" }}>
        <Title order={4} mb="xs">
          Bot do Telegram
        </Title>
        <Text c="var(--text-muted)" mb="md">
          Gere um código temporário para vincular a sua empresa ao bot do Telegram.
        </Text>
        <Button loading={generateTelegramLinkCode.isPending} onClick={handleGenerateCode}>
          Gerar código do Telegram
        </Button>
      </Paper>

      <Modal opened={modalOpened} onClose={closeModal} title="Vincular Telegram" centered>
        <Stack gap="sm">
          <Text>Envie esta mensagem para o bot no Telegram:</Text>
          <Code block>/vincular {linkCode}</Code>
          <Text size="sm" c="var(--text-muted)">
            Este código expira em 10 minutos. Se você gerar um novo código, o anterior deixará de ser válido.
          </Text>
          <Button onClick={closeModal}>Fechar</Button>
        </Stack>
      </Modal>
    </div>
  );
}
