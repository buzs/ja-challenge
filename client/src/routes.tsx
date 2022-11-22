import { BrowserRouter, Routes as RoutesDom, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { RequireAuth } from "./hooks/Auth";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Register from "./pages/Register/indext";

export default function Routes() {
  return (
    <BrowserRouter>
      <RoutesDom>
        <Route path="/" element={<Login />} index />
        <Route
          path="/projects"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Projects />} />
          <Route path="new-user" element={<Register />} />
        </Route>
      </RoutesDom>
    </BrowserRouter>
  );
}
