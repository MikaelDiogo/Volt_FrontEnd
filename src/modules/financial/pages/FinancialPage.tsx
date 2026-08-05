import { useState } from "react";
import { SimpleGrid, Text, Group, Button, Modal, ActionIcon, Badge } from "@mantine/core";
import { IconEye, IconPencil, IconTrash, IconCheck } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Panel } from "@/shared/components/Panel";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { usePagination } from "@/shared/hooks/usePagination";
import { formatCurrencyBRL, formatDate } from "@/shared/utils/formatters";
import {
  useFinancialTransactionsList,
  useCreateFinancialTransaction,
  useUpdateFinancialTransaction,
  useDeleteFinancialTransaction,
  useMarkPaidFinancialTransaction,
} from "../hooks/useFinancialTransactions";
import { FinancialTransactionForm } from "../components/FinancialTransactionForm";
import type { FinancialTransaction } from "../types/financial.types";

function getErrorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return message ? String(message) : fallback;
}

export default function FinancialPage() {
  const { page, perPage, setPage } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [viewingTransaction, setViewingTransaction] = useState<FinancialTransaction | null>(null);

  const { data, isLoading } = useFinancialTransactionsList({ page, perPage });
  const createMutation = useCreateFinancialTransaction();
  const updateMutation = useUpdateFinancialTransaction();
  const deleteMutation = useDeleteFinancialTransaction();
  const markPaidMutation = useMarkPaidFinancialTransaction();

  const transactions = data?.data ?? [];
  const entradas = transactions
    .filter((t) => t.type === "receivable" && Boolean(t.paidAt))
    .reduce((sum, t) => sum + t.amount, 0);
  const saidas = transactions
    .filter((t) => t.type === "payable" && Boolean(t.paidAt))
    .reduce((sum, t) => sum + t.amount, 0);
  const saldo = entradas - saidas;

  function handleDelete(transaction: FinancialTransaction) {
    modals.openConfirmModal({
      title: "Excluir transação",
      children: `Tem certeza que deseja excluir esta transação de ${formatCurrencyBRL(transaction.amount)}?`,
      labels: { confirm: "Excluir", cancel: "Cancelar" },
      confirmProps: { color: "danger" },
      onConfirm: () => {
        deleteMutation.mutate(transaction.id, {
          onSuccess: () => {
            notifications.show({
              color: "accent",
              title: "Transação excluída",
              message: "Transação excluída com sucesso.",
            });
          },
          onError: (error: unknown) => {
            notifications.show({
              color: "danger",
              title: "Erro",
              message: getErrorMessage(error, "Não foi possível excluir a transação."),
            });
          },
        });
      },
    });
  }

  function handleMarkPaid(transaction: FinancialTransaction) {
    markPaidMutation.mutate(transaction.id, {
      onSuccess: () => {
        notifications.show({
          color: "accent",
          title: "Transação atualizada",
          message: "Transação marcada como paga.",
        });
      },
      onError: (error: unknown) => {
        notifications.show({
          color: "danger",
          title: "Erro",
          message: getErrorMessage(error, "Não foi possível marcar a transação como paga."),
        });
      },
    });
  }

  const columns: DataTableColumn<FinancialTransaction>[] = [
    {
      key: "type",
      header: "Tipo",
      render: (row) => (
        <Badge color={row.type === "receivable" ? "accent" : "danger"} variant="light">
          {row.type === "receivable" ? "Receita" : "Despesa"}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "Valor",
      render: (row) => (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
          {formatCurrencyBRL(row.amount)}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Vencimento",
      render: (row) => (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
          {row.dueDate ? formatDate(row.dueDate) : "-"}
        </span>
      ),
    },
    {
      key: "paidAt",
      header: "Status",
      render: (row) => (
        <Badge color={row.paidAt ? "accent" : "gray"} variant="light">
          {row.paidAt ? "Pago" : "Pendente"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      render: (row) => (
        <Group gap={4}>
          <ActionIcon color="gray" variant="subtle" aria-label="Visualizar" onClick={() => setViewingTransaction(row)}>
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon color="accent" variant="subtle" aria-label="Editar" onClick={() => setEditingTransaction(row)}>
            <IconPencil size={16} />
          </ActionIcon>
          {!row.paidAt && (
            <ActionIcon
              color="accent"
              variant="subtle"
              aria-label="Marcar como pago"
              onClick={() => handleMarkPaid(row)}
              loading={markPaidMutation.isPending && markPaidMutation.variables === row.id}
            >
              <IconCheck size={16} />
            </ActionIcon>
          )}
          <ActionIcon
            color="danger"
            variant="subtle"
            aria-label="Excluir"
            onClick={() => handleDelete(row)}
            loading={deleteMutation.isPending && deleteMutation.variables === row.id}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  return (
    <div>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="md">
        <Panel>
          <Text style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Entradas (pagas)
          </Text>
          <Text style={{ fontSize: 24, fontWeight: 600, color: "var(--accent)", marginTop: 6 }}>
            {formatCurrencyBRL(entradas)}
          </Text>
        </Panel>
        <Panel>
          <Text style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Saídas (pagas)
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

      <Group justify="flex-end" mb="md">
        <Button color="accent" onClick={() => setModalOpen(true)}>
          Nova transação
        </Button>
      </Group>

      <DataTable<FinancialTransaction>
        data={transactions}
        meta={data?.meta ?? { page: 1, perPage, total: 0, totalPages: 0 }}
        onPageChange={setPage}
        columns={columns}
        emptyLabel={isLoading ? "Carregando..." : "Nenhuma transação financeira encontrada."}
      />

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Nova transação">
        <FinancialTransactionForm
          submitting={createMutation.isPending}
          onSubmit={(values) => {
            createMutation.mutate(
              { ...values, dueDate: values.dueDate || undefined },
              {
                onSuccess: () => {
                  setModalOpen(false);
                  notifications.show({
                    color: "accent",
                    title: "Transação criada",
                    message: "Transação cadastrada com sucesso.",
                  });
                },
                onError: (error: unknown) => {
                  notifications.show({
                    color: "danger",
                    title: "Erro",
                    message: getErrorMessage(error, "Não foi possível criar a transação."),
                  });
                },
              },
            );
          }}
        />
      </Modal>

      <Modal
        opened={Boolean(editingTransaction)}
        onClose={() => setEditingTransaction(null)}
        title="Editar transação"
      >
        {editingTransaction && (
          <FinancialTransactionForm
            submitting={updateMutation.isPending}
            initialValues={{
              type: editingTransaction.type,
              amount: editingTransaction.amount,
              dueDate: editingTransaction.dueDate ?? "",
            }}
            onSubmit={(values) => {
              updateMutation.mutate(
                { id: editingTransaction.id, dto: { ...values, dueDate: values.dueDate || undefined } },
                {
                  onSuccess: () => {
                    setEditingTransaction(null);
                    notifications.show({
                      color: "accent",
                      title: "Transação atualizada",
                      message: "As alterações foram salvas com sucesso.",
                    });
                  },
                  onError: (error: unknown) => {
                    notifications.show({
                      color: "danger",
                      title: "Erro",
                      message: getErrorMessage(error, "Não foi possível atualizar a transação."),
                    });
                  },
                },
              );
            }}
          />
        )}
      </Modal>

      <Modal
        opened={Boolean(viewingTransaction)}
        onClose={() => setViewingTransaction(null)}
        title="Detalhes da transação"
      >
        {viewingTransaction && (
          <FinancialTransactionForm
            readOnly
            initialValues={{
              type: viewingTransaction.type,
              amount: viewingTransaction.amount,
              dueDate: viewingTransaction.dueDate ?? "",
            }}
            onSubmit={() => {}}
          />
        )}
      </Modal>
    </div>
  );
}
