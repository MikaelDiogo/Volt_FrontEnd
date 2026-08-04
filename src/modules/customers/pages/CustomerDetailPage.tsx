import { useParams } from "react-router-dom";
import { Title, Paper, Stack, Text, Table } from "@mantine/core";
import { useCustomerDetail, useCustomerServiceOrders } from "../hooks/useCustomers";
import { formatDate } from "@/shared/utils/formatters";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading } = useCustomerDetail(id);
  const { data: orders } = useCustomerServiceOrders(id);

  if (isLoading) {
    return (
      <div>
        <Text c="dimmed">Carregando cliente...</Text>
      </div>
    );
  }

  if (!customer) {
    return (
      <div>
        <Text c="dimmed">Cliente não encontrado.</Text>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960 }}>
      <Title order={2} mb="md">
        {customer.name}
      </Title>

      <Paper p="lg" radius="lg" mb="md" style={{ backgroundColor: "var(--bg-panel)" }}>
        <Stack gap="xs">
          <Text>
            <b>CPF/CNPJ:</b> {customer.document ?? "-"}
          </Text>
          <Text>
            <b>Telefone:</b> {customer.phone ?? "-"}
          </Text>
          <Text>
            <b>E-mail:</b> {customer.email ?? "-"}
          </Text>
          <Text>
            <b>Cliente desde:</b> {formatDate(customer.createdAt)}
          </Text>
        </Stack>
      </Paper>

      <Title order={4} mb="sm">
        Histórico de Ordens de Serviço
      </Title>
      <Paper p="lg" radius="lg" style={{ backgroundColor: "var(--bg-panel)" }}>
        {!orders || orders.length === 0 ? (
          <Text c="dimmed">Nenhuma ordem de serviço registrada para este cliente ainda.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Aparelho</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Data</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orders.map((order) => (
                <Table.Tr key={order.id}>
                  <Table.Td>{order.deviceModel}</Table.Td>
                  <Table.Td>{order.status}</Table.Td>
                  <Table.Td>{formatDate(order.createdAt)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    </div>
  );
}
