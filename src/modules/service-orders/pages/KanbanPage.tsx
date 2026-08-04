import { useState } from "react";
import { Text, Modal, Stack, Group, Textarea, Button, Checkbox, Divider } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Panel } from "@/shared/components/Panel";
import { ServiceOrderStatusBadge } from "../components/ServiceOrderStatusBadge";
import { useServiceOrdersList, useUpdateServiceOrder } from "../hooks/useServiceOrders";
import { ServiceOrderStatus, type ServiceOrder } from "../types/service-order.types";
import { formatCurrencyBRL, formatImei, formatDate } from "@/shared/utils/formatters";

const COLUMNS: { status: ServiceOrderStatus; label: string }[] = [
  { status: ServiceOrderStatus.PENDING, label: "Aberta" },
  { status: ServiceOrderStatus.IN_REPAIR, label: "Em Reparo" },
  { status: ServiceOrderStatus.READY, label: "Pronta" },
  { status: ServiceOrderStatus.DELIVERED, label: "Entregue" },
  { status: ServiceOrderStatus.CANCELLED, label: "Cancelada" },
];

function KanbanCard({
  order,
  onOpen,
  onDragStart,
}: {
  order: ServiceOrder;
  onOpen: () => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      style={{
        backgroundColor: "var(--bg)",
        border: "1px solid var(--border-panel)",
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 8,
        cursor: "grab",
      }}
    >
      <Text style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
        {order.protocolNumber ?? `#${order.id.slice(0, 6).toUpperCase()}`}
      </Text>
      <Text style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{order.deviceModel}</Text>
      <Text style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{order.customerName}</Text>
      <Text style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 4 }} lineClamp={2}>
        {order.reportedIssue}
      </Text>
      <Text style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent)", marginTop: 6 }}>
        {formatCurrencyBRL(order.estimatedCost ?? 0)}
      </Text>
    </div>
  );
}

function OrderDetailModal({ order, onClose }: { order: ServiceOrder; onClose: () => void }) {
  const updateMutation = useUpdateServiceOrder();
  const [notes, setNotes] = useState(order.internalNotes ?? "");

  function handleSaveNotes() {
    updateMutation.mutate(
      { id: order.id, dto: { internalNotes: notes } },
      {
        onSuccess: () => {
          notifications.show({ color: "accent", title: "Anotações salvas", message: "Ordem de serviço atualizada." });
        },
        onError: () => {
          notifications.show({ color: "danger", title: "Erro", message: "Não foi possível salvar as anotações." });
        },
      },
    );
  }

  return (
    <Modal opened onClose={onClose} title={order.protocolNumber ?? `O.S. #${order.id.slice(0, 8).toUpperCase()}`} size="lg">
      <Stack gap="sm">
        <Group justify="space-between">
          <Text style={{ fontSize: 13 }}>
            <b>Cliente:</b> {order.customerName}
          </Text>
          <ServiceOrderStatusBadge status={order.status} />
        </Group>
        <Text style={{ fontSize: 13 }}>
          <b>Categoria:</b> {order.deviceCategory}
        </Text>
        <Text style={{ fontSize: 13 }}>
          <b>Aparelho:</b> {order.deviceModel} — {formatImei(order.deviceIdentifier)}
        </Text>
        <Text style={{ fontSize: 13 }}>
          <b>Defeito relatado:</b> {order.reportedIssue}
        </Text>
        <Text style={{ fontSize: 13 }}>
          <b>Retirada por:</b> {order.recipientName ?? "—"}
          {order.recipientPhone ? ` — ${order.recipientPhone}` : ""}
        </Text>
        {order.estimatedDeliveryDate && (
          <Text style={{ fontSize: 13 }}>
            <b>Previsão de entrega:</b> {formatDate(order.estimatedDeliveryDate)}
          </Text>
        )}
        <Text style={{ fontSize: 13 }}>
          <b>Valor estimado:</b> {formatCurrencyBRL(order.estimatedCost ?? 0)}
        </Text>
        <Text style={{ fontSize: 13 }}>
          <b>Aberta em:</b> {formatDate(order.createdAt, true)}
        </Text>

        {order.checklist.length > 0 && (
          <Stack gap={4}>
            <Text fw={600} size="sm">
              Checklist técnico
            </Text>
            {order.checklist.map((item, index) => (
              <Checkbox key={index} label={item.label} checked={item.checked} readOnly />
            ))}
          </Stack>
        )}

        {order.technicalReport && (
          <Text style={{ fontSize: 13 }}>
            <b>Laudo técnico:</b> {order.technicalReport}
          </Text>
        )}

        <Divider label="Justificativa de problemas / anotações" labelPosition="left" mt="xs" />
        <Textarea
          placeholder="Ex.: aparelho apresentou problema adicional ao abrir, peça não compatível, cliente foi avisado, etc. (opcional)"
          minRows={3}
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
        />
        <Button color="accent" onClick={handleSaveNotes} loading={updateMutation.isPending} w="fit-content">
          Salvar anotações
        </Button>
      </Stack>
    </Modal>
  );
}

export default function KanbanPage() {
  const { data, isLoading } = useServiceOrdersList(
    { page: 1, perPage: 200 },
    { refetchInterval: 10_000, staleTime: 0 },
  );
  const updateMutation = useUpdateServiceOrder();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<ServiceOrderStatus | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  const orders = data?.data ?? [];

  function handleDrop(status: ServiceOrderStatus) {
    setDragOverStatus(null);
    if (!draggingId) return;
    const order = orders.find((o) => o.id === draggingId);
    setDraggingId(null);
    if (!order || order.status === status) return;

    updateMutation.mutate(
      { id: order.id, dto: { status } },
      {
        onSuccess: () => {
          notifications.show({
            color: "accent",
            title: "Status atualizado",
            message: `${order.protocolNumber ?? order.deviceModel} movida para "${
              COLUMNS.find((c) => c.status === status)?.label
            }".`,
          });
        },
        onError: () => {
          notifications.show({ color: "danger", title: "Erro", message: "Não foi possível mover a ordem de serviço." });
        },
      },
    );
  }

  return (
    <div>
      {isLoading ? (
        <Text style={{ fontSize: 13, color: "var(--text-muted)" }}>Carregando...</Text>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {COLUMNS.map((col) => {
            const columnOrders = orders.filter((o) => o.status === col.status);
            const isOver = dragOverStatus === col.status;
            return (
              <div
                key={col.status}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverStatus(col.status);
                }}
                onDragLeave={() => setDragOverStatus((s) => (s === col.status ? null : s))}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(col.status);
                }}
              >
                <Panel
                  style={{
                    minHeight: 400,
                    backgroundColor: isOver ? "rgba(76,125,255,0.06)" : undefined,
                    border: isOver ? "1px dashed var(--accent)" : undefined,
                  }}
                >
                  <Group justify="space-between" mb={10}>
                    <Text style={{ fontSize: 13, fontWeight: 600 }}>{col.label}</Text>
                    <Text style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {columnOrders.length}
                    </Text>
                  </Group>
                  {columnOrders.length === 0 ? (
                    <Text style={{ fontSize: 12, color: "var(--text-muted)" }}>Nenhuma O.S.</Text>
                  ) : (
                    columnOrders.map((order) => (
                      <KanbanCard
                        key={order.id}
                        order={order}
                        onOpen={() => setSelectedOrder(order)}
                        onDragStart={() => setDraggingId(order.id)}
                      />
                    ))
                  )}
                </Panel>
              </div>
            );
          })}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
