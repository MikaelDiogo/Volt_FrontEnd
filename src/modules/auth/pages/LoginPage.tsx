import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, TextInput, PasswordInput, Button, Stack, Title, Alert } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { login as loginRequest, decodeJwt } from "../services/auth.service";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validate: zodResolver(loginSchema),
  });

  async function handleSubmit(values: LoginFormValues) {
    setError(null);
    setSubmitting(true);
    try {
      const { accessToken, refreshToken } = await loginRequest(values);
      const payload = decodeJwt(accessToken);
      login(
        {
          id: payload.sub,
          name: values.email.split("@")[0],
          email: values.email,
          role: payload.role,
          companyId: payload.companyId,
        },
        accessToken,
        refreshToken,
      );
      navigate("/", { replace: true });
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError("E-mail ou senha inválidos.");
      } else {
        setError("Não foi possível conectar ao servidor. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Paper w="100%" p="xl" radius="lg" style={{ backgroundColor: "var(--bg-panel)" }}>
      <Stack gap="md">
        <Title order={3} c="var(--text)">
          Entrar
        </Title>
        {error && (
          <Alert color="danger" title="Erro">
            {error}
          </Alert>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput label="E-mail" placeholder="voce@empresa.com" {...form.getInputProps("email")} />
            <PasswordInput label="Senha" placeholder="••••••••" {...form.getInputProps("password")} />
            <Button type="submit" color="accent" fullWidth mt="sm" loading={submitting}>
              Entrar
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
