import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import Routes from "./routes";
import { AuthProvider } from "./hooks/Auth";

function App() {
  return (
    <MantineProvider
      theme={{
        colorScheme: "dark",
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <NotificationsProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
