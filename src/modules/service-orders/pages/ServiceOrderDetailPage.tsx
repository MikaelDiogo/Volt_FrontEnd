import { useParams } from "react-router-dom";
import { Title, Text, Paper, Stack, Group, Textarea, Button, Checkbox } from "@mantine/core";
import { useServiceOrderDetail, useUpdateServiceOrder } from "../hooks/useServiceOrders";
import { ServiceOrderStatusBadge } from "../components/ServiceOrderStatusBadge";
import { ServiceOrderStatus } from "../types/service-order.types";
import { formatDate, formatImei } from "@/shared/utils/formatters";

export default function ServiceOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useServiceOrderDetail(id);
  const updateMutation = useUpdateServiceOrder();

  if (isLoading) {
    return (
      <div>
        <Text c="dimmed">Carregando ordem de serviço...</Text>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Text c="dimmed">Ordem de serviço não encontrada.</Text>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960 }}>
      <Group justify="space-between" mb="md">
        <Title order={2}>{order.protocolNumber ?? `O.S. #${order.id.slice(0, 8).toUpperCase()}`}</Title>
        <ServiceOrderStatusBadge status={order.status} />
      </Group>

      <Paper p="lg" radius="lg" style={{ backgroundColor: "var(--bg-panel)" }}>
        <Stack gap="sm">
          <Text>
            <b>Cliente:</b> {order.customerName}
          </Text>
          <Text>
            <b>Categoria:</b> {order.deviceCategory}
          </Text>
          <Text>
            <b>Aparelho:</b> {order.deviceModel} — {formatImei(order.deviceIdentifier)}
          </Text>
          <Text>
            <b>Defeito relatado:</b> {order.reportedIssue}
          </Text>
          <Text>
            <b>Retirada por:</b> {order.recipientName ?? "—"}
            {order.recipientPhone ? ` — ${order.recipientPhone}` : ""}
          </Text>
          {order.estimatedDeliveryDate && (
            <Text>
              <b>Previsão de entrega:</b> {formatDate(order.estimatedDeliveryDate)}
            </Text>
          )}
          <Text>
            <b>Aberta em:</b> {formatDate(order.createdAt, true)}
          </Text>

          <Stack gap={4}>
            <Text fw={600}>Checklist técnico</Text>
            {order.checklist.map((item, index) => (
              <Checkbox key={index} label={item.label} checked={item.checked} readOnly />
            ))}
          </Stack>

          <Textarea
            label="Laudo técnico"
            defaultValue={order.technicalReport ?? ""}
            minRows={4}
            onBlur={(e) =>
              updateMutation.mutate({ id: order.id, dto: { technicalReport: e.currentTarget.value } })
            }
          />

          <Button
            color="accent"
            w="fit-content"
            loading={updateMutation.isPending}
            onClick={() => updateMutation.mutate({ id: order.id, dto: { status: ServiceOrderStatus.IN_REPAIR } })}
          >
            Iniciar Reparo
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
