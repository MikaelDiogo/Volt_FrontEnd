import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Group, Button, Modal, TextInput, Anchor } from "@mantine/core";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { usePagination } from "@/shared/hooks/usePagination";
import { useCustomersList, useCreateCustomer } from "../hooks/useCustomers";
import { CustomerForm } from "../components/CustomerForm";
import type { Customer } from "../types/customer.types";

export default function CustomersPage() {
  const navigate = useNavigate();
  const { page, perPage, setPage } = usePagination();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useCustomersList({ page, perPage, search: search || undefined });
  const createMutation = useCreateCustomer();

  const columns: DataTableColumn<Customer>[] = [
    {
      key: "name",
      header: "Nome",
      render: (row) => (
        <Anchor onClick={() => navigate(`/clientes/${row.id}`)} c="var(--accent)">
          {row.name}
        </Anchor>
      ),
    },
    { key: "document", header: "CPF / CNPJ" },
    { key: "phone", header: "Telefone" },
    { key: "email", header: "E-mail" },
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
    </div>
  );
}
