import { AppShell, Navbar, Header, Text, Center, NavLink } from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import { IconUser, IconBriefcase } from "@tabler/icons";

export default function Layout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <NavLink
            icon={<IconBriefcase size={16} stroke={1.5} />}
            label="Projects"
            active={pathname === "/projects"}
            onClick={() => {
              if (pathname !== "/projects") navigate("/projects");
            }}
          />
          <NavLink
            icon={<IconUser size={16} stroke={1.5} />}
            label="Create new user"
            active={pathname === "/projects/new-user"}
            onClick={() => {
              if (pathname !== "/projects/new-user")
                navigate("/projects/new-user");
            }}
          />
        </Navbar>
      }
      header={
        <Header height={45} p="xs">
          <Center inline>
            <Text>
              Welcome, <b>{user.name}</b>
            </Text>
          </Center>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
    </AppShell>
  );
}
