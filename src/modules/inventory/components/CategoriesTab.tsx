import { useState } from "react";
import { Stack, Group, Button, Modal, TextInput, Badge } from "@mantine/core";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { useDeviceCategoriesList, useCreateDeviceCategory } from "../hooks/useDeviceCategories";
import { DeviceCategoryForm } from "./DeviceCategoryForm";
import type { DeviceCategory } from "../types/device-category.types";

export function CategoriesTab() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useDeviceCategoriesList();
  const createMutation = useCreateDeviceCategory();

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
    </Stack>
  );
}
