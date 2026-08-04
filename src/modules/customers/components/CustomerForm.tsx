import { Stack, TextInput, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { createCustomerSchema, type CreateCustomerSchema } from "../schemas/customer.schema";
import { maskPhone, maskDocument } from "@/shared/utils/masks";

interface CustomerFormProps {
  initialValues?: Partial<CreateCustomerSchema>;
  onSubmit: (values: CreateCustomerSchema) => void;
  submitting?: boolean;
}

export function CustomerForm({ initialValues, onSubmit, submitting }: CustomerFormProps) {
  const form = useForm<CreateCustomerSchema>({
    initialValues: { name: "", document: "", phone: "", email: "", ...initialValues },
    validate: zodResolver(createCustomerSchema),
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="sm">
        <TextInput label="Nome" {...form.getInputProps("name")} />
        <TextInput
          label="CPF / CNPJ"
          placeholder="000.000.000-00"
          maxLength={18}
          {...form.getInputProps("document")}
          onChange={(e) => form.setFieldValue("document", maskDocument(e.currentTarget.value))}
        />
        <TextInput
          label="Telefone"
          placeholder="(00) 00000-0000"
          maxLength={15}
          {...form.getInputProps("phone")}
          onChange={(e) => form.setFieldValue("phone", maskPhone(e.currentTarget.value))}
        />
        <TextInput label="E-mail" {...form.getInputProps("email")} />
        <Button type="submit" color="accent" loading={submitting}>
          Salvar cliente
        </Button>
      </Stack>
    </form>
  );
}
