import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import { RootRedirect } from "./RootRedirect";
import { AppLayout } from "@/components/layout/AppLayout";

import { Login } from "@/pages/auth/Login";
import { CadastroPaciente } from "@/pages/auth/CadastroPaciente";
import { SelecaoPerfil } from "@/pages/auth/SelecaoPerfil";
import { DashboardAdmin } from "@/pages/admin/DashboardAdmin";
import { GerenciarAtendentes } from "@/pages/admin/GerenciarAtendentes";
import { GerenciarMedicos } from "@/pages/admin/GerenciarMedicos";
import { GerenciarPacientes } from "@/pages/admin/GerenciarPacientes";
import { FormularioMedico } from "@/pages/admin/FormularioMedico";
import { DashboardPaciente } from "@/pages/paciente/DashboardPaciente";
import { AgendarConsulta } from "@/pages/paciente/AgendarConsulta";
import { MinhasConsultas } from "@/pages/paciente/MinhasConsultas";
import { DetalheConsulta } from "@/pages/paciente/DetalheConsulta";
import { ResultadosExames } from "@/pages/paciente/ResultadosExames";
import { Toaster } from "sonner";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroPaciente />} />

        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/selecionar-perfil" element={<SelecaoPerfil />} />

            <Route element={<RoleRoute allowedRoles={["ADMINISTRADOR"]} />}>
              <Route path="/admin" element={<DashboardAdmin />} />

              <Route path="/admin/medicos" element={<GerenciarMedicos />} />
              <Route
                path="/admin/medicos/novo"
                element={<FormularioMedico />}
              />
              <Route
                path="/admin/medicos/:id/editar"
                element={<FormularioMedico />}
              />

              <Route path="/admin/pacientes" element={<GerenciarPacientes />} />
              <Route
                path="/admin/atendentes"
                element={<GerenciarAtendentes />}
              />
              <Route path="/admin/pacientes" element={<GerenciarPacientes />} />
              <Route
                path="/admin/atendentes"
                element={<GerenciarAtendentes />}
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
              <Route path="/paciente" element={<DashboardPaciente />} />
              <Route path="/paciente/agendar" element={<AgendarConsulta />} />
              <Route path="/paciente/consultas" element={<MinhasConsultas />} />
              <Route
                path="/paciente/consultas/:id"
                element={<DetalheConsulta />}
              />
              <Route path="/paciente/exames" element={<ResultadosExames />} />
            </Route>
          </Route>
        </Route>

        <Route path="/forbidden" element={<div>Erro 403: Acesso Negado</div>} />
        <Route path="*" element={<div>Erro 404: Página não encontrada</div>} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}
