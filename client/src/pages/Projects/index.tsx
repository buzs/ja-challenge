import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/Auth";
import { Table, Menu, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconSettings, IconMessageCircle, IconTrash } from "@tabler/icons";
import api from "../../services/api";

const ActionMenu = ({ id }: { id: string }) => {
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

    window.location.reload();
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
    window.location.reload();
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button>A</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<IconSettings size={14} />}>Edit</Menu.Item>
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

export default function Projects() {
  const { user } = useAuth();

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("projects", {
        headers: {
          username: user.username,
        },
      })
      .then((response) => setProjects(response.data));
  }, [user.username]);

  const rows = projects.map((project) => (
    <tr>
      <td>{project.title}</td>
      <td>{project.deadline}</td>
      <td>{project.done ? "🟢" : "🔴"}</td>
      <td>
        <ActionMenu id={project.id} />
      </td>
    </tr>
  ));

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button>Create new project</Button>
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
  );
}
