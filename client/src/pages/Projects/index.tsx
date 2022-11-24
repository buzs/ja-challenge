import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../../hooks/Auth";
import {
  Table,
  Menu,
  Button,
  Drawer,
  InputBase,
  SimpleGrid,
  TextInput,
  NumberInput,
  Input,
  Flex,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import InputMask from "react-input-mask";
import { showNotification } from "@mantine/notifications";
import { IconSettings, IconMessageCircle, IconTrash } from "@tabler/icons";
import api from "../../services/api";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";

export const ActionMenu = ({
  id,
  updateProjects,
  openProject,
}: {
  id: string;
  updateProjects: () => void;
  openProject: (id: string) => void;
}) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${id}`, {
        headers: {
          username: user.username,
        },
      });

      showNotification({
        color: "green",
        message: "Project deleted successfully",
      });
    } catch (e) {
      console.log(e);

      showNotification({
        color: "red",
        message: "Error deleting project, try again later",
      });
    }

    updateProjects();
  };

  const handleFinalize = async () => {
    try {
      await api.patch(
        `/projects/${id}/done`,
        {},
        {
          headers: {
            username: user.username,
          },
        }
      );

      showNotification({
        color: "green",
        message: "Project finalized successfully",
      });
    } catch (e) {
      console.log(e);

      showNotification({
        color: "red",
        message: "Error finalizing project, try again later",
      });
    }
    updateProjects();
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button>Actions</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => openProject(id)}
          icon={<IconSettings size={14} />}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          onClick={handleFinalize}
          icon={<IconMessageCircle size={14} />}
        >
          Finalize
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          onClick={handleDelete}
          color="red"
          icon={<IconTrash size={14} />}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export function Project({
  id,
  openedState,
  updateProjects,
}: {
  openedState: [boolean, Dispatch<SetStateAction<boolean>>];
  updateProjects: () => void;
  id?: string;
}) {
  const { user } = useAuth();
  const [opened, setOpened] = openedState;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const response = await api.get(`/project/${id}`, {
        headers: {
          username: user.username,
        },
      });

      console.log(response.data);
      form.setValues({
        ...response.data,
        deadline: new Date(response.data.deadline),
        zip_code: String(response.data.zip_code),
      });
      setLoading(false);
    };

    if (id) {
      fetchProject();
    }
    // form.insertListItem
  }, [id, user.username]);

  const form = useForm({
    initialValues: {
      id: "",
      title: "",
      cost: "",
      deadline: "",
      city: "Unknown",
      state: "Unknown",
      zip_code: "",
    },
    validate: {},
  });

  useEffect(() => {
    if (!id) {
      form.reset();
    }
  }, [id]);

  useEffect(() => {
    if (!opened) {
      setLoading(false);
    }
  }, [opened]);

  return (
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      title={id ? "Edit project" : "Create project"}
      padding="xl"
      size="xl"
    >
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <form
          onSubmit={form.onSubmit(async (values) => {
            setLoading(true);

            try {
              if (id) {
                await api.put(
                  `/projects/${id}`,
                  {
                    title: values.title,
                    cost: values.cost,
                    deadline: values.deadline,
                    zip_code: values.zip_code.replace("-", ""),
                  },
                  {
                    headers: {
                      username: user.username,
                    },
                  }
                );
                showNotification({
                  color: "green",
                  message: `Project [${values.title}] updated`,
                });
              } else {
                await api.post(
                  "/project",
                  {
                    title: values.title,
                    cost: Number(values.cost),
                    deadline: values.deadline,
                    zip_code: values.zip_code.replace("-", ""),
                  },
                  {
                    headers: {
                      username: user.username,
                    },
                  }
                );

                showNotification({
                  color: "green",
                  message: `Project [${values.title}] created`,
                });
              }
              setOpened(false);
              updateProjects();
            } catch (e) {
              showNotification({
                color: "red",
                message: `Error ${id ? "updating" : "creating"} project [${
                  values.title
                }], try again later`,
              });
            } finally {
              setLoading(false);
            }
          })}
        >
          <SimpleGrid spacing="sm" cols={1}>
            {id && (
              <TextInput label="ID" disabled {...form.getInputProps("id")} />
            )}
            <TextInput
              label="Title"
              placeholder="Project Name"
              required
              {...form.getInputProps("title")}
            />
            <NumberInput
              label="Cost"
              required
              {...form.getInputProps("cost")}
              defaultValue={5000}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value!))
                  ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : "$ "
              }
            />
            <Input.Wrapper
              label="CEP"
              required
              {...form.getInputProps("zip_code")}
            >
              <Input
                component={InputMask}
                mask="99999-999"
                id={id}
                placeholder="XXXXX-XXX"
                {...form.getInputProps("zip_code")}
              />
            </Input.Wrapper>
            {id && (
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="City"
                    disabled
                    {...form.getInputProps("city")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="State"
                    disabled
                    {...form.getInputProps("state")}
                  />
                </Grid.Col>
              </Grid>
            )}
            <DatePicker
              placeholder="Project end date"
              label="Deadline"
              withAsterisk
              {...form.getInputProps("deadline")}
            />
            <Button type="submit" mt="sm">
              Save
            </Button>
          </SimpleGrid>
        </form>
      </div>
    </Drawer>
  );
}

export default function Projects() {
  const { user } = useAuth();

  const [projects, setProjects] = useState<any[]>([]);
  const [openProject, setOpenProject] = useState(false);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/projects", {
        headers: {
          username: user.username,
        },
      });

      setProjects(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProject = (id?: string) => {
    setProjectId(id || undefined);
    setOpenProject(true);
  };

  useEffect(() => {
    handleProjects();
  }, []);

  useEffect(() => {
    if (!openProject) {
      setProjectId(undefined);
    }
  }, [openProject]);

  const rows = projects.map((project) => (
    <tr>
      <td>{project.title}</td>
      <td>{dayjs(project.deadline).format("dddd, DD MMMM YYYY")}</td>
      <td>{project.done ? "🟢 Finished" : "🔴 In Progress"}</td>
      <td>
        <ActionMenu
          id={project.id}
          openProject={handleOpenProject}
          updateProjects={handleProjects}
        />
      </td>
    </tr>
  ));

  return (
    <div>
      <Project
        id={projectId}
        openedState={[openProject, setOpenProject]}
        updateProjects={handleProjects}
      />
      <Button onClick={() => setOpenProject(true)}>Create new project</Button>
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <Table
          sx={{ minWidth: 800 }}
          verticalSpacing="xs"
          striped
          highlightOnHover
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>Deadline</th>
              <th>Done</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </div>
  );
}
