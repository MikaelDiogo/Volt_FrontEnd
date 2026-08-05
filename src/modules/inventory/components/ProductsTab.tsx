import { useState } from "react";
import { Stack, Group, Button, Modal, TextInput, ActionIcon } from "@mantine/core";
import { IconTrash, IconPencil, IconEye } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { usePagination } from "@/shared/hooks/usePagination";
import { formatCurrencyBRL } from "@/shared/utils/formatters";
import { useProductsList, useCreateProduct, useUpdateProduct, useDeleteProduct } from "../hooks/useProducts";
import { ProductForm } from "./ProductForm";
import type { Product } from "../types/product.types";

export function ProductsTab() {
  const { page, perPage, setPage } = usePagination();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const { data, isLoading } = useProductsList({ page, perPage, search: search || undefined });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  function handleDelete(product: Product) {
    modals.openConfirmModal({
      title: "Excluir produto",
      children: `Tem certeza que deseja excluir este produto (${product.name})?`,
      labels: { confirm: "Excluir", cancel: "Cancelar" },
      confirmProps: { color: "danger" },
      onConfirm: () => {
        deleteMutation.mutate(product.id, {
          onSuccess: () => {
            notifications.show({
              color: "accent",
              title: "Produto excluído",
              message: "Produto excluído com sucesso.",
            });
          },
          onError: (error: unknown) => {
            const message =
              (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              "Não foi possível excluir o produto.";
            notifications.show({ color: "danger", title: "Erro", message: String(message) });
          },
        });
      },
    });
  }

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
    {
      key: "actions",
      header: "Ações",
      render: (row) => (
        <Group gap={4}>
          <ActionIcon color="gray" variant="subtle" onClick={() => setViewingProduct(row)}>
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon color="accent" variant="subtle" onClick={() => setEditingProduct(row)}>
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon
            color="danger"
            variant="subtle"
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

      <Modal opened={Boolean(editingProduct)} onClose={() => setEditingProduct(null)} title="Editar produto">
        {editingProduct && (
          <ProductForm
            submitting={updateMutation.isPending}
            initialValues={{
              name: editingProduct.name,
              deviceCategoryId: editingProduct.deviceCategoryId ?? undefined,
              minStock: editingProduct.minStock,
              costPrice: editingProduct.costPrice ?? undefined,
              salePrice: editingProduct.salePrice ?? undefined,
            }}
            onSubmit={(values) =>
              updateMutation.mutate(
                {
                  id: editingProduct.id,
                  dto: {
                    name: values.name,
                    minStock: values.minStock,
                    costPrice: values.costPrice,
                    salePrice: values.salePrice,
                  },
                },
                {
                  onSuccess: () => {
                    setEditingProduct(null);
                    notifications.show({
                      color: "accent",
                      title: "Produto atualizado",
                      message: "Produto atualizado com sucesso.",
                    });
                  },
                  onError: (error: unknown) => {
                    const message =
                      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                      "Não foi possível atualizar o produto.";
                    notifications.show({ color: "danger", title: "Erro", message: String(message) });
                  },
                },
              )
            }
          />
        )}
      </Modal>

      <Modal opened={Boolean(viewingProduct)} onClose={() => setViewingProduct(null)} title="Detalhes do produto">
        {viewingProduct && (
          <ProductForm
            readOnly
            initialValues={{
              name: viewingProduct.name,
              deviceCategoryId: viewingProduct.deviceCategoryId ?? undefined,
              minStock: viewingProduct.minStock,
              costPrice: viewingProduct.costPrice ?? undefined,
              salePrice: viewingProduct.salePrice ?? undefined,
            }}
            onSubmit={() => {}}
          />
        )}
      </Modal>
    </Stack>
  );
}
