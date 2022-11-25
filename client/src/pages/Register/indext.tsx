import {
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { valueGetters } from "@mantine/core/lib/Box/style-system-props/value-getters/value-getters";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import api from "../../services/api";

export default function Register() {
  const form = useForm({
    initialValues: {
      name: "",
      username: "",
      password: "",
      passwordConfirm: "",
    },
  });

  return (
    <>
      <Container size="md" px="xs">
        <Paper p="md">
          <Title order={2} mt="md" mb={50}>
            Register new user
          </Title>
          <form
            onSubmit={form.onSubmit(async (values) => {
              if (values.password === values.passwordConfirm) {
                try {
                  await api
                    .post("/users", {
                      name: values.name,
                      username: values.username,
                      password: values.password,
                    })
                    .then(() => {
                      showNotification({
                        color: "green",
                        message: "User created",
                      });

                      form.reset();
                    });
                } catch (e) {
                  showNotification({
                    color: "red",
                    message: "Error creating user, try again later",
                  });
                }
              }
            })}
          >
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Name"
                  size="md"
                  {...form.getInputProps("name")}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <TextInput
                  label="Username"
                  size="md"
                  {...form.getInputProps("username")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <PasswordInput
                  label="Password"
                  size="md"
                  {...form.getInputProps("password")}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <PasswordInput
                  label="Retry Password"
                  size="md"
                  {...form.getInputProps("passwordConfirm")}
                />
              </Grid.Col>
            </Grid>
            <Group position="right" pt="sm">
              <Button type="submit">Save</Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </>
  );
}
