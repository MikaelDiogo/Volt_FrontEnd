import type { ReactNode } from "react";
import { Table, Pagination, Group, Text, Stack } from "@mantine/core";
import type { PaginatedResponse } from "@/shared/types/pagination";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  meta: PaginatedResponse<T>["meta"];
  onPageChange: (page: number) => void;
  columns: DataTableColumn<T>[];
  emptyLabel?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  meta,
  onPageChange,
  columns,
  emptyLabel = "Nenhum registro encontrado.",
}: DataTableProps<T>) {
  return (
    <Stack gap="sm">
      <Table.ScrollContainer minWidth={480} className="rn-scrollbar">
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={col.key}>{col.header}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Text c="dimmed" ta="center" py="md">
                    {emptyLabel}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              data.map((row) => (
                <Table.Tr key={row.id}>
                  {columns.map((col) => (
                    <Table.Td key={col.key}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {meta.totalPages > 1 && (
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {meta.total} registro(s) — página {meta.page} de {meta.totalPages}
          </Text>
          <Pagination value={meta.page} onChange={onPageChange} total={meta.totalPages} color="accent" />
        </Group>
      )}
    </Stack>
  );
}
