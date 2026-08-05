import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Group, Button, Modal, TextInput, ActionIcon } from "@mantine/core";
import { IconEye, IconPencil } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { usePagination } from "@/shared/hooks/usePagination";
import { formatImei, formatCurrencyBRL } from "@/shared/utils/formatters";
import { useServiceOrdersList, useCreateServiceOrder, useUpdateServiceOrder } from "../hooks/useServiceOrders";
import { ServiceOrderStatusBadge } from "../components/ServiceOrderStatusBadge";
import { ServiceOrderForm } from "../components/ServiceOrderForm";
import { ServiceOrderStatus } from "../types/service-order.types";
import type { ServiceOrder } from "../types/service-order.types";

interface StatusFilterPill {
  label: string;
  status?: ServiceOrderStatus;
}

const STATUS_FILTERS: StatusFilterPill[] = [
  { label: "Todas" },
  { label: "Aberta", status: ServiceOrderStatus.PENDING },
  { label: "Em Diagnóstico", status: ServiceOrderStatus.PENDING },
  { label: "Em Reparo", status: ServiceOrderStatus.IN_REPAIR },
  { label: "Pronta", status: ServiceOrderStatus.READY },
  { label: "Entregue", status: ServiceOrderStatus.DELIVERED },
];

export default function ServiceOrdersPage() {
  const navigate = useNavigate();
  const { page, perPage, setPage } = usePagination();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("Todas");

  const activeStatus = STATUS_FILTERS.find((f) => f.label === activeFilter)?.status;

  const { data, isLoading } = useServiceOrdersList({
    page,
    perPage,
    search: search || undefined,
    status: activeStatus,
  });
  const createMutation = useCreateServiceOrder();
  const updateMutation = useUpdateServiceOrder();

  const columns: DataTableColumn<ServiceOrder>[] = [
    {
      key: "id",
      header: "O.S. Nº",
      render: (row) => (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
          {row.protocolNumber ?? `#${row.id.slice(0, 6).toUpperCase()}`}
        </span>
      ),
    },
    {
      key: "customerName",
      header: "Cliente / Aparelho",
      render: (row) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{row.customerName}</div>
          <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{row.deviceModel}</div>
        </div>
      ),
    },
    { key: "deviceCategory", header: "Categoria" },
    {
      key: "deviceIdentifier",
      header: "Identificador",
      render: (row) => (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
          {formatImei(row.deviceIdentifier)}
        </span>
      ),
    },
    { key: "reportedIssue", header: "Defeito" },
    { key: "status", header: "Status", render: (row) => <ServiceOrderStatusBadge status={row.status} /> },
    {
      key: "estimatedCost",
      header: "Valor",
      render: (row) => (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
          {formatCurrencyBRL(row.estimatedCost ?? 0)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      render: (row) => (
        <Group gap={4}>
          <ActionIcon
            color="gray"
            variant="subtle"
            aria-label="Visualizar"
            onClick={() => navigate(`/ordens-servico/${row.id}`)}
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            color="accent"
            variant="subtle"
            aria-label="Editar"
            onClick={() => setEditingOrder(row)}
          >
            <IconPencil size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  return (
    <div>
      <Group justify="flex-end" mb="md">
        <Button color="accent" onClick={() => setModalOpen(true)}>
          Nova O.S.
        </Button>
      </Group>

      <TextInput
        placeholder="Buscar por cliente, IMEI ou modelo..."
        mb="md"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      <Group gap={8} mb="md">
        {STATUS_FILTERS.map((filter) => {
          const active = filter.label === activeFilter;
          return (
            <button
              key={filter.label}
              type="button"
              onClick={() => {
                setActiveFilter(filter.label);
                setPage(1);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 100,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                border: active ? "1px solid var(--accent)" : "1px solid var(--border-emphasis)",
                backgroundColor: active ? "rgba(76,125,255,0.1)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              {filter.label}
            </button>
          );
        })}
      </Group>

      <DataTable<ServiceOrder>
        data={data?.data ?? []}
        meta={data?.meta ?? { page: 1, perPage, total: 0, totalPages: 0 }}
        onPageChange={setPage}
        columns={columns}
        emptyLabel={isLoading ? "Carregando..." : "Nenhuma ordem de serviço encontrada."}
      />

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Nova Ordem de Serviço" size="lg">
        <ServiceOrderForm
          submitting={createMutation.isPending}
          onSubmit={(values) => {
            createMutation.mutate(values, {
              onSuccess: (created) => {
                setModalOpen(false);
                notifications.show({
                  color: "accent",
                  title: "Ordem de serviço criada",
                  message: created.protocolNumber ?? "O.S. cadastrada com sucesso.",
                });
                navigate(`/ordens-servico/${created.id}`);
              },
              onError: (error: unknown) => {
                const message =
                  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                  "Não foi possível criar a ordem de serviço.";
                notifications.show({ color: "danger", title: "Erro", message: String(message) });
              },
            });
          }}
        />
      </Modal>

      <Modal
        opened={Boolean(editingOrder)}
        onClose={() => setEditingOrder(null)}
        title="Editar Ordem de Serviço"
        size="lg"
      >
        {editingOrder && (
          <ServiceOrderForm
            submitting={updateMutation.isPending}
            initialValues={{
              deviceId: editingOrder.deviceId,
              reportedIssue: editingOrder.reportedIssue,
              checklist: editingOrder.checklist.map((c) => ({ item: c.label, checked: c.checked })),
              estimatedDeliveryDate: editingOrder.estimatedDeliveryDate ?? undefined,
              estimatedCost: editingOrder.estimatedCost ?? undefined,
              recipientName: editingOrder.recipientName ?? "",
              recipientPhone: editingOrder.recipientPhone ?? "",
            }}
            onSubmit={(values) => {
              updateMutation.mutate(
                { id: editingOrder.id, dto: values },
                {
                  onSuccess: () => {
                    setEditingOrder(null);
                    notifications.show({
                      color: "accent",
                      title: "Ordem de serviço atualizada",
                      message: "As alterações foram salvas com sucesso.",
                    });
                  },
                  onError: (error: unknown) => {
                    const message =
                      (error as { response?: { data?: { message?: string } } })?.response?.data
                        ?.message ?? "Não foi possível atualizar a ordem de serviço.";
                    notifications.show({ color: "danger", title: "Erro", message: String(message) });
                  },
                },
              );
            }}
          />
        )}
      </Modal>
    </div>
  );
}
