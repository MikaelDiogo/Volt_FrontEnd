import { Stack, NumberInput, Select, TextInput, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { createFinancialTransactionSchema, type CreateFinancialTransactionSchema } from "../schemas/financial.schema";

interface FinancialTransactionFormProps {
  onSubmit: (values: CreateFinancialTransactionSchema) => void;
  submitting?: boolean;
  initialValues?: CreateFinancialTransactionSchema;
  readOnly?: boolean;
}

export function FinancialTransactionForm({
  onSubmit,
  submitting,
  initialValues,
  readOnly,
}: FinancialTransactionFormProps) {
  const form = useForm<CreateFinancialTransactionSchema>({
    initialValues:
      initialValues ?? {
        type: "payable",
        amount: 0,
        dueDate: "",
      },
    validate: zodResolver(createFinancialTransactionSchema),
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="sm">
        <Select
          label="Tipo"
          data={[
            { value: "payable", label: "Despesa (a pagar)" },
            { value: "receivable", label: "Receita (a receber)" },
          ]}
          disabled={readOnly}
          allowDeselect={false}
          {...form.getInputProps("type")}
        />
        <NumberInput
          label="Valor"
          min={0}
          decimalScale={2}
          prefix="R$ "
          readOnly={readOnly}
          {...form.getInputProps("amount")}
        />
        <TextInput
          label="Data de vencimento"
          type="date"
          readOnly={readOnly}
          {...form.getInputProps("dueDate")}
        />
        {!readOnly && (
          <Button type="submit" color="accent" loading={submitting}>
            Salvar transação
          </Button>
        )}
      </Stack>
    </form>
  );
}
