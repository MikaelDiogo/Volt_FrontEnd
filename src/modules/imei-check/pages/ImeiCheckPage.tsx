import { Paper, Text, TextInput, Button, Stack, Alert } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { imeiCheckSchema, type ImeiCheckSchema } from "../schemas/imei-check.schema";
import { useImeiCheck } from "../hooks/useImeiCheck";
import { maskImei } from "@/shared/utils/masks";

export default function ImeiCheckPage() {
  const checkMutation = useImeiCheck();
  const form = useForm<ImeiCheckSchema>({
    initialValues: { imei: "" },
    validate: zodResolver(imeiCheckSchema),
  });

  return (
    <div style={{ maxWidth: 560 }}>
      <Paper p="lg" radius="lg" style={{ backgroundColor: "var(--bg-panel)" }}>
        <Text c="var(--text-muted)" mb="md">
          Consulta de restrição de IMEI (roubo/furto, bloqueio de operadora) via integração externa —
          aplicável a celulares e tablets com chip. Para aparelhos sem IMEI, o histórico por número de
          série funciona normalmente, sem checagem de restrição (ver seção 6.8 da documentação técnica).
        </Text>
        <form onSubmit={form.onSubmit((values) => checkMutation.mutate(values.imei))}>
          <Stack gap="sm">
            <TextInput
              label="IMEI"
              placeholder="00 000000 000000 0"
              maxLength={18}
              {...form.getInputProps("imei")}
              onChange={(e) => form.setFieldValue("imei", maskImei(e.currentTarget.value))}
            />
            <Button type="submit" color="accent" loading={checkMutation.isPending} w="fit-content">
              Consultar
            </Button>
          </Stack>
        </form>

        {checkMutation.data && (
          <Alert
            mt="md"
            color={checkMutation.data.hasRestriction ? "danger" : "success"}
            title={checkMutation.data.hasRestriction ? "Restrição encontrada" : "Sem restrições"}
          >
            IMEI {checkMutation.data.imei} consultado.
          </Alert>
        )}
      </Paper>
    </div>
  );
}
