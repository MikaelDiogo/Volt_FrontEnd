import { useState } from "react";
import { Stack, Group, Button, Modal, TextInput, Select } from "@mantine/core";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { usePagination } from "@/shared/hooks/usePagination";
import { formatImei } from "@/shared/utils/formatters";
import { useDevicesList, useCreateDevice, useUpdateDevice } from "../hooks/useDevices";
import { DeviceForm } from "./DeviceForm";
import { DeviceStatus, type Device } from "../types/device.types";

const STATUS_OPTIONS = [
  { value: DeviceStatus.IN_STOCK, label: "Em estoque" },
  { value: DeviceStatus.SOLD, label: "Vendido" },
  { value: DeviceStatus.IN_REPAIR, label: "Em reparo" },
];

const STATUS_COLOR: Record<DeviceStatus, string> = {
  [DeviceStatus.IN_STOCK]: "var(--text-secondary)",
  [DeviceStatus.SOLD]: "var(--text-muted)",
  [DeviceStatus.IN_REPAIR]: "var(--warning)",
};

function DeviceStatusSelect({ device }: { device: Device }) {
  const updateMutation = useUpdateDevice();

  return (
    <Select
      size="xs"
      data={STATUS_OPTIONS}
      value={device.status}
      onChange={(value) => {
        if (!value || value === device.status) return;
        updateMutation.mutate({ id: device.id, dto: { status: value as DeviceStatus } });
      }}
      disabled={updateMutation.isPending}
      allowDeselect={false}
      styles={{ input: { color: STATUS_COLOR[device.status], fontWeight: 600, fontSize: 12.5 } }}
      w={140}
    />
  );
}

export function DevicesTab() {
  const { page, perPage, setPage } = usePagination();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useDevicesList({ page, perPage, search: search || undefined });
  const createMutation = useCreateDevice();

  const columns: DataTableColumn<Device>[] = [
    { key: "model", header: "Produto" },
    { key: "categoryName", header: "Categoria" },
    {
      key: "uniqueIdentifier",
      header: "Identificador",
      render: (row) => (
        <span style={{ fontFamily: "var(--font-mono)" }}>{formatImei(row.uniqueIdentifier)}</span>
      ),
    },
    { key: "status", header: "Status", render: (row) => <DeviceStatusSelect device={row} /> },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <TextInput
          placeholder="Buscar por modelo ou IMEI..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          flex={1}
        />
        <Button color="accent" onClick={() => setModalOpen(true)}>
          Novo aparelho
        </Button>
      </Group>

      <DataTable<Device>
        data={data?.data ?? []}
        meta={data?.meta ?? { page: 1, perPage, total: 0, totalPages: 0 }}
        onPageChange={setPage}
        columns={columns}
        emptyLabel={isLoading ? "Carregando..." : "Nenhum aparelho cadastrado."}
      />

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Novo aparelho">
        <DeviceForm
          submitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values, { onSuccess: () => setModalOpen(false) })}
        />
      </Modal>
    </Stack>
  );
}
