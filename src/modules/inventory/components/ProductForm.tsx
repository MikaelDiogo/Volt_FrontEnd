import { Stack, TextInput, NumberInput, Select, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { createProductSchema, type CreateProductSchema } from "../schemas/product.schema";
import { useDeviceCategoriesList } from "../hooks/useDeviceCategories";

interface ProductFormProps {
  onSubmit: (values: CreateProductSchema) => void;
  submitting?: boolean;
  initialValues?: CreateProductSchema;
  readOnly?: boolean;
}

export function ProductForm({ onSubmit, submitting, initialValues, readOnly }: ProductFormProps) {
  const { data: categories, isLoading: categoriesLoading } = useDeviceCategoriesList();

  const form = useForm<CreateProductSchema>({
    initialValues:
      initialValues ?? {
        name: "",
        deviceCategoryId: undefined,
        minStock: 0,
        costPrice: undefined,
        salePrice: undefined,
      },
    validate: zodResolver(createProductSchema),
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="sm">
        <TextInput
          label="Nome da peça"
          placeholder="ex.: Botão de controle PS4"
          readOnly={readOnly}
          {...form.getInputProps("name")}
        />
        <Select
          label="Categoria (opcional)"
          placeholder={categoriesLoading ? "Carregando..." : "Selecione"}
          data={(categories ?? []).map((c) => ({ value: c.id, label: c.name }))}
          disabled={categoriesLoading || readOnly}
          clearable
          {...form.getInputProps("deviceCategoryId")}
        />
        <NumberInput
          label="Estoque mínimo"
          min={0}
          readOnly={readOnly}
          {...form.getInputProps("minStock")}
        />
        <NumberInput
          label="Preço de custo"
          min={0}
          decimalScale={2}
          prefix="R$ "
          readOnly={readOnly}
          {...form.getInputProps("costPrice")}
        />
        <NumberInput
          label="Preço de venda"
          min={0}
          decimalScale={2}
          prefix="R$ "
          readOnly={readOnly}
          {...form.getInputProps("salePrice")}
        />
        {!readOnly && (
          <Button type="submit" color="accent" loading={submitting}>
            Salvar peça
          </Button>
        )}
      </Stack>
    </form>
  );
}
