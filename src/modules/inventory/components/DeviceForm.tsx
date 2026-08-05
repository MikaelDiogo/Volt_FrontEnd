import { Stack, TextInput, Select, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { createDeviceSchema, type CreateDeviceSchema } from "../schemas/device.schema";
import { DeviceStatus } from "../types/device.types";
import { useDeviceCategoriesList } from "../hooks/useDeviceCategories";

interface DeviceFormProps {
  onSubmit: (values: CreateDeviceSchema) => void;
  submitting?: boolean;
  initialValues?: CreateDeviceSchema;
  readOnly?: boolean;
}

export function DeviceForm({ onSubmit, submitting, initialValues, readOnly }: DeviceFormProps) {
  const { data: categories, isLoading: categoriesLoading } = useDeviceCategoriesList();

  const form = useForm<CreateDeviceSchema>({
    initialValues:
      initialValues ?? {
        uniqueIdentifier: "",
        model: "",
        deviceCategoryId: "",
        status: DeviceStatus.IN_STOCK,
      },
    validate: zodResolver(createDeviceSchema),
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="sm">
        <TextInput
          label="Modelo"
          placeholder="ex.: iPhone 12, PS5 Slim"
          readOnly={readOnly}
          {...form.getInputProps("model")}
        />
        <Select
          label="Categoria"
          placeholder={categoriesLoading ? "Carregando..." : "Selecione"}
          data={(categories ?? []).map((c) => ({ value: c.id, label: c.name }))}
          disabled={categoriesLoading || readOnly}
          {...form.getInputProps("deviceCategoryId")}
        />
        <TextInput
          label="IMEI / nº de série (opcional)"
          placeholder="Deixe em branco se o aparelho não tiver"
          description="Sem identificador, o sistema gera um código interno automático (#00001, #00002...)"
          readOnly={readOnly}
          {...form.getInputProps("uniqueIdentifier")}
        />
        <Select
          label="Status"
          data={[
            { value: "IN_STOCK", label: "Em estoque" },
            { value: "SOLD", label: "Vendido" },
            { value: "IN_REPAIR", label: "Em reparo" },
          ]}
          disabled={readOnly}
          {...form.getInputProps("status")}
        />
        {!readOnly && (
          <Button type="submit" color="accent" loading={submitting}>
            Salvar aparelho
          </Button>
        )}
      </Stack>
    </form>
  );
}
