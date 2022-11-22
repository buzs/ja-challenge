import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";

export default function Login() {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => !value && "Username is required",
      password: (value) => !value && "Password is required",
    },
  });

  let navigate = useNavigate();
  let location = useLocation();
  const { signin } = useAuth();

  let from = location.state?.from?.pathname || "/projects";

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((values) =>
            signin(values, () => {
              navigate(from, { replace: true });
            })
          )}
        >
          <TextInput
            label="Username"
            placeholder="Your username"
            required
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
