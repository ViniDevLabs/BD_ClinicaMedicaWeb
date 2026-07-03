import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import { RootRedirect } from "./RootRedirect";
import { LoginPage } from "@/pages/Login";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<div>Cadastro (Em breve)</div>} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<RootRedirect />} />

          <Route element={<RoleRoute allowedRoles={["ADMINISTRADOR"]} />}>
            <Route
              path="/admin"
              element={<div>Dashboard do Administrador</div>}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={["MEDICO"]} />}>
            <Route path="/medico" element={<div>Dashboard do Médico</div>} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["ATENDENTE"]} />}>
            <Route
              path="/atendente"
              element={<div>Dashboard da Atendente</div>}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={["PACIENTE"]} />}>
            <Route
              path="/paciente"
              element={<div>Dashboard do Paciente</div>}
            />
          </Route>
        </Route>

        <Route path="/forbidden" element={<div>Erro 403: Acesso Negado</div>} />
        <Route path="*" element={<div>Erro 404: Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
