import { useState } from "react";
import { Stack, Group, Button, Modal, TextInput } from "@mantine/core";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { usePagination } from "@/shared/hooks/usePagination";
import { formatCurrencyBRL } from "@/shared/utils/formatters";
import { useProductsList, useCreateProduct } from "../hooks/useProducts";
import { ProductForm } from "./ProductForm";
import type { Product } from "../types/product.types";

export function ProductsTab() {
  const { page, perPage, setPage } = usePagination();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useProductsList({ page, perPage, search: search || undefined });
  const createMutation = useCreateProduct();

  const columns: DataTableColumn<Product>[] = [
    { key: "name", header: "Produto" },
    { key: "categoryName", header: "Categoria" },
    {
      key: "costPrice",
      header: "Custo",
      render: (row) => (
        <span style={{ fontFamily: "var(--font-mono)" }}>{formatCurrencyBRL(row.costPrice ?? 0)}</span>
      ),
    },
    {
      key: "quantity",
      header: "Qtd.",
      render: (row) => (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: row.quantity <= row.minStock ? "#ff7a5c" : "var(--text)",
          }}
        >
          {row.quantity}
        </span>
      ),
    },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <TextInput
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          flex={1}
        />
        <Button color="accent" onClick={() => setModalOpen(true)}>
          Novo produto
        </Button>
      </Group>

      <DataTable<Product>
        data={data?.data ?? []}
        meta={data?.meta ?? { page: 1, perPage, total: 0, totalPages: 0 }}
        onPageChange={setPage}
        columns={columns}
        emptyLabel={isLoading ? "Carregando..." : "Nenhum produto cadastrado."}
      />

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Novo produto">
        <ProductForm
          submitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values, { onSuccess: () => setModalOpen(false) })}
        />
      </Modal>
    </Stack>
  );
}
