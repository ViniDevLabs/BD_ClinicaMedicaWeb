import { type Role } from "@/types/usuario";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Stethoscope,
  Calendar,
  CalendarPlus,
  FileText,
} from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

export const ROLE_NAVIGATION: Record<Role, NavItem[]> = {
  ADMINISTRADOR: [
    { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { title: "Gerenciar Médicos", path: "/admin/medicos", icon: Stethoscope },
    { title: "Gerenciar Pacientes", path: "/admin/pacientes", icon: Users },
    { title: "Gerenciar Atendentes", path: "/admin/atendentes", icon: UserCog },
  ],
  MEDICO: [
    { title: "Painel Médico", path: "/medico", icon: LayoutDashboard },
    { title: "Agenda de Consultas", path: "/medico/consultas", icon: Calendar },
    { title: "Meus Pacientes", path: "/medico/pacientes", icon: Users },
  ],
  ATENDENTE: [
    {
      title: "Painel de Atendimento",
      path: "/atendente",
      icon: LayoutDashboard,
    },
    {
      title: "Controle de Agendamentos",
      path: "/atendente/agendamentos",
      icon: Calendar,
    },
  ],
  PACIENTE: [
    { title: "Meu Resumo", path: "/paciente", icon: LayoutDashboard },
    {
      title: "Agendar Consulta",
      path: "/paciente/agendar",
      icon: CalendarPlus,
    },
    { title: "Minhas Consultas", path: "/paciente/consultas", icon: Calendar },
    { title: "Resultados de Exames", path: "/paciente/exames", icon: FileText },
  ],
};
