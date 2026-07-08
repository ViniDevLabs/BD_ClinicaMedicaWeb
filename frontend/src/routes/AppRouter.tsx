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
import { DashboardMedico } from "@/pages/medico/DashboardMedico";
import { AgendaConsultas } from "@/pages/medico/AgendaConsultas";
import { AtenderConsulta } from "@/pages/medico/AtenderConsulta";
import { MinhaDisponibilidade } from "@/pages/medico/MinhaDisponibilidade";
import { Toaster } from "sonner";
import { FormularioPaciente } from "@/pages/admin/FormularioPaciente";
import { FormularioAtendente } from "@/pages/admin/FormularioAtendente";
import { Forbidden } from "@/pages/errors/Forbidden";
import { NotFound } from "@/pages/errors/NotFound";
import { AgendamentosAtendente } from "@/pages/atendente/AgendamentosAtendente";
import { DashboardAtendente } from "@/pages/atendente/DashboardAtendente";

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
              <Route path="/admin/medicos/novo" element={<FormularioMedico />} />
              <Route path="/admin/medicos/:id/editar" element={<FormularioMedico />} />

              <Route path="/admin/pacientes" element={<GerenciarPacientes />} />
              <Route path="/admin/pacientes/novo" element={<FormularioPaciente />} />
              <Route path="/admin/pacientes/:id/editar" element={<FormularioPaciente />} />

              <Route path="/admin/atendentes" element={<GerenciarAtendentes />} />
              <Route path="/admin/atendentes/novo" element={<FormularioAtendente />} />
              <Route path="/admin/atendentes/:id/editar" element={<FormularioAtendente />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["MEDICO"]} />}>
              <Route path="/medico" element={<DashboardMedico />} />
              <Route path="/medico/consultas" element={<AgendaConsultas />} />
              <Route
                path="/medico/consultas/:id"
                element={<AtenderConsulta />}
              />
              <Route
                path="/medico/disponibilidade"
                element={<MinhaDisponibilidade />}
              />
            </Route>

            <Route element={<RoleRoute allowedRoles={["ATENDENTE"]} />}>
              <Route path="/atendente" element={<DashboardAtendente />} />
              <Route path="/atendente/agendamentos" element={<AgendamentosAtendente />} />
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

        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}