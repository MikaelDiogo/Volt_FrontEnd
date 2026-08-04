import { Stack, TextInput, Textarea, Select, Button, Checkbox, Group, ActionIcon, NumberInput, Divider, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { createServiceOrderSchema, type CreateServiceOrderSchema } from "../schemas/service-order.schema";
import { useDevicesList } from "@/modules/inventory/hooks/useDevices";
import { formatImei } from "@/shared/utils/formatters";
import { maskPhone } from "@/shared/utils/masks";

interface ServiceOrderFormProps {
  initialValues?: Partial<CreateServiceOrderSchema>;
  onSubmit: (values: CreateServiceOrderSchema) => void;
  submitting?: boolean;
}

export function ServiceOrderForm({ initialValues, onSubmit, submitting }: ServiceOrderFormProps) {
  const { data: devicesData, isLoading: devicesLoading } = useDevicesList({ page: 1, perPage: 200 });

  const deviceOptions = (devicesData?.data ?? []).map((device) => ({
    value: device.id,
    label: `${device.model} — ${formatImei(device.uniqueIdentifier)}`,
  }));

  const form = useForm<CreateServiceOrderSchema>({
    initialValues: {
      deviceId: "",
      reportedIssue: "",
      checklist: [],
      estimatedDeliveryDate: undefined,
      estimatedCost: undefined,
      recipientName: "",
      recipientPhone: "",
      ...initialValues,
    },
    validate: zodResolver(createServiceOrderSchema),
  });

  function addChecklistItem() {
    form.insertListItem("checklist", { item: "", checked: false });
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="sm">
        <Select
          label="Aparelho"
          placeholder={devicesLoading ? "Carregando aparelhos..." : "Selecione o aparelho cadastrado"}
          data={deviceOptions}
          searchable
          disabled={devicesLoading}
          nothingFoundMessage="Nenhum aparelho encontrado. Cadastre em Estoque / IMEI."
          {...form.getInputProps("deviceId")}
        />
        <Textarea
          label="O que precisa ser consertado"
          placeholder="Descreva o defeito relatado pelo cliente e o que será feito no reparo"
          minRows={3}
          {...form.getInputProps("reportedIssue")}
        />

        <Group grow>
          <DateInput
            label="Previsão de entrega"
            placeholder="Selecione a data"
            valueFormat="DD/MM/YYYY"
            value={form.values.estimatedDeliveryDate ? new Date(form.values.estimatedDeliveryDate) : null}
            onChange={(value) => {
              const iso = value ? new Date(value as unknown as string).toISOString().slice(0, 10) : undefined;
              form.setFieldValue("estimatedDeliveryDate", iso);
            }}
          />
          <NumberInput
            label="Valor estimado"
            placeholder="0,00"
            prefix="R$ "
            decimalScale={2}
            {...form.getInputProps("estimatedCost")}
          />
        </Group>

        <Divider label="Quem vai retirar o aparelho" labelPosition="left" mt="xs" />

        <Group grow>
          <TextInput
            label="Nome de quem vai receber"
            placeholder="Nome completo"
            {...form.getInputProps("recipientName")}
          />
          <TextInput
            label="Telefone para contato"
            placeholder="(00) 00000-0000"
            maxLength={15}
            {...form.getInputProps("recipientPhone")}
            onChange={(e) => form.setFieldValue("recipientPhone", maskPhone(e.currentTarget.value))}
          />
        </Group>

        <Stack gap={4} mt="xs">
          <Group justify="space-between">
            <Text size="sm">Checklist técnico (itens a consertar)</Text>
            <Button size="xs" variant="subtle" color="accent" onClick={addChecklistItem}>
              + item
            </Button>
          </Group>
          {form.values.checklist.map((_item, index) => (
            <Group key={index} gap="xs">
              <Checkbox {...form.getInputProps(`checklist.${index}.checked`, { type: "checkbox" })} />
              <Textarea
                autosize
                minRows={1}
                flex={1}
                placeholder="ex.: trocar tela, bateria, leitor de disco"
                {...form.getInputProps(`checklist.${index}.item`)}
              />
              <ActionIcon color="danger" variant="subtle" onClick={() => form.removeListItem("checklist", index)}>
                ×
              </ActionIcon>
            </Group>
          ))}
        </Stack>

        <Button type="submit" color="accent" loading={submitting} mt="sm">
          Salvar Ordem de Serviço
        </Button>
      </Stack>
    </form>
  );
}
