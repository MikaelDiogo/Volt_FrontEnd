import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Group, Button, Modal, TextInput, ActionIcon } from "@mantine/core";
import { IconEye, IconPencil } from "@tabler/icons-react";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { usePagination } from "@/shared/hooks/usePagination";
import { useCustomersList, useCreateCustomer, useUpdateCustomer } from "../hooks/useCustomers";
import { CustomerForm } from "../components/CustomerForm";
import type { Customer } from "../types/customer.types";

export default function CustomersPage() {
  const navigate = useNavigate();
  const { page, perPage, setPage } = usePagination();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const { data, isLoading } = useCustomersList({ page, perPage, search: search || undefined });
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const columns: DataTableColumn<Customer>[] = [
    { key: "name", header: "Nome" },
    { key: "document", header: "CPF / CNPJ" },
    { key: "phone", header: "Telefone" },
    { key: "email", header: "E-mail" },
    {
      key: "actions",
      header: "Ações",
      render: (row) => (
        <Group gap="xs">
          <ActionIcon color="gray" variant="subtle" onClick={() => navigate(`/clientes/${row.id}`)}>
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon color="accent" variant="subtle" onClick={() => setEditingCustomer(row)}>
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
          Novo cliente
        </Button>
      </Group>

      <TextInput
        placeholder="Buscar por nome, documento ou telefone..."
        mb="md"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      <DataTable<Customer>
        data={data?.data ?? []}
        meta={data?.meta ?? { page: 1, perPage, total: 0, totalPages: 0 }}
        onPageChange={setPage}
        columns={columns}
        emptyLabel={isLoading ? "Carregando..." : "Nenhum cliente cadastrado."}
      />

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Novo cliente">
        <CustomerForm
          submitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values, { onSuccess: () => setModalOpen(false) })}
        />
      </Modal>

      <Modal opened={Boolean(editingCustomer)} onClose={() => setEditingCustomer(null)} title="Editar cliente">
        {editingCustomer && (
          <CustomerForm
            initialValues={{
              name: editingCustomer.name,
              document: editingCustomer.document ?? "",
              phone: editingCustomer.phone ?? "",
              email: editingCustomer.email ?? "",
            }}
            submitting={updateMutation.isPending}
            onSubmit={(values) =>
              updateMutation.mutate(
                { id: editingCustomer.id, dto: values },
                { onSuccess: () => setEditingCustomer(null) },
              )
            }
          />
        )}
      </Modal>
    </div>
  );
}
