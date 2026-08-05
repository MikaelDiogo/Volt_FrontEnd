import { Stack, TextInput, Checkbox, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  createDeviceCategorySchema,
  type CreateDeviceCategorySchema,
} from "../schemas/device-category.schema";

interface DeviceCategoryFormProps {
  onSubmit: (values: CreateDeviceCategorySchema) => void;
  submitting?: boolean;
  initialValues?: CreateDeviceCategorySchema;
  readOnly?: boolean;
}

export function DeviceCategoryForm({ onSubmit, submitting, initialValues, readOnly }: DeviceCategoryFormProps) {
  const form = useForm<CreateDeviceCategorySchema>({
    initialValues: initialValues ?? { name: "", hasImei: false, defaultChecklist: [] },
    validate: zodResolver(createDeviceCategorySchema),
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="sm">
        <TextInput
          label="Nome da categoria"
          placeholder="ex.: Smartphone, Console"
          readOnly={readOnly}
          {...form.getInputProps("name")}
        />
        <Checkbox
          label="Possui IMEI (chip)"
          disabled={readOnly}
          {...form.getInputProps("hasImei", { type: "checkbox" })}
        />
        {!readOnly && (
          <Button type="submit" color="accent" loading={submitting}>
            Salvar categoria
          </Button>
        )}
      </Stack>
    </form>
  );
}
