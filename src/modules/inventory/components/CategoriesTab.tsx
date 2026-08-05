import { useState } from "react";
import { Stack, Group, Button, Modal, TextInput, Badge, ActionIcon } from "@mantine/core";
import { IconTrash, IconPencil, IconEye } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import {
  useDeviceCategoriesList,
  useCreateDeviceCategory,
  useUpdateDeviceCategory,
  useDeleteDeviceCategory,
} from "../hooks/useDeviceCategories";
import { DeviceCategoryForm } from "./DeviceCategoryForm";
import type { DeviceCategory } from "../types/device-category.types";

export function CategoriesTab() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DeviceCategory | null>(null);
  const [viewingCategory, setViewingCategory] = useState<DeviceCategory | null>(null);

  const { data, isLoading } = useDeviceCategoriesList();
  const createMutation = useCreateDeviceCategory();
  const updateMutation = useUpdateDeviceCategory();
  const deleteMutation = useDeleteDeviceCategory();

  function handleDelete(category: DeviceCategory) {
    modals.openConfirmModal({
      title: "Excluir categoria",
      children: `Tem certeza que deseja excluir esta categoria (${category.name})?`,
      labels: { confirm: "Excluir", cancel: "Cancelar" },
      confirmProps: { color: "danger" },
      onConfirm: () => {
        deleteMutation.mutate(category.id, {
          onSuccess: () => {
            notifications.show({
              color: "accent",
              title: "Categoria excluída",
              message: "Categoria excluída com sucesso.",
            });
          },
          onError: (error: unknown) => {
            const message =
              (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              "Não foi possível excluir a categoria.";
            notifications.show({ color: "danger", title: "Erro", message: String(message) });
          },
        });
      },
    });
  }

  const categories = (data ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: DataTableColumn<DeviceCategory>[] = [
    { key: "name", header: "Categoria" },
    {
      key: "hasImei",
      header: "Possui IMEI",
      render: (row) => (
        <Badge color={row.hasImei ? "accent" : "gray"} variant={row.hasImei ? "filled" : "outline"}>
          {row.hasImei ? "Sim" : "Não"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      render: (row) => (
        <Group gap={4}>
          <ActionIcon color="gray" variant="subtle" onClick={() => setViewingCategory(row)}>
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon color="accent" variant="subtle" onClick={() => setEditingCategory(row)}>
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
          placeholder="Buscar categoria..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          flex={1}
        />
        <Button color="accent" onClick={() => setModalOpen(true)}>
          Nova categoria
        </Button>
      </Group>

      <DataTable<DeviceCategory>
        data={categories}
        meta={{ page: 1, perPage: categories.length || 1, total: categories.length, totalPages: 1 }}
        onPageChange={() => {}}
        columns={columns}
        emptyLabel={isLoading ? "Carregando..." : "Nenhuma categoria cadastrada."}
      />

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Nova categoria de aparelho">
        <DeviceCategoryForm
          submitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values, { onSuccess: () => setModalOpen(false) })}
        />
      </Modal>

      <Modal
        opened={Boolean(editingCategory)}
        onClose={() => setEditingCategory(null)}
        title="Editar categoria de aparelho"
      >
        {editingCategory && (
          <DeviceCategoryForm
            submitting={updateMutation.isPending}
            initialValues={{
              name: editingCategory.name,
              hasImei: editingCategory.hasImei,
              defaultChecklist: editingCategory.defaultChecklist,
            }}
            onSubmit={(values) =>
              updateMutation.mutate(
                { id: editingCategory.id, dto: values },
                {
                  onSuccess: () => {
                    setEditingCategory(null);
                    notifications.show({
                      color: "accent",
                      title: "Categoria atualizada",
                      message: "Categoria atualizada com sucesso.",
                    });
                  },
                  onError: (error: unknown) => {
                    const message =
                      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                      "Não foi possível atualizar a categoria.";
                    notifications.show({ color: "danger", title: "Erro", message: String(message) });
                  },
                },
              )
            }
          />
        )}
      </Modal>

      <Modal
        opened={Boolean(viewingCategory)}
        onClose={() => setViewingCategory(null)}
        title="Detalhes da categoria"
      >
        {viewingCategory && (
          <DeviceCategoryForm
            readOnly
            initialValues={{
              name: viewingCategory.name,
              hasImei: viewingCategory.hasImei,
              defaultChecklist: viewingCategory.defaultChecklist,
            }}
            onSubmit={() => {}}
          />
        )}
      </Modal>
    </Stack>
  );
}
