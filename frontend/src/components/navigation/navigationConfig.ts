import { type Role } from "@/types/usuario";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Stethoscope,
  Calendar,
} from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

export const ROLE_NAVIGATION: Record<Role, NavItem[]> = {
  ADMINISTRADOR: [
    { title: "Dashboard Admin", path: "/admin", icon: LayoutDashboard },
    { title: "Médicos", path: "/admin/medicos", icon: Stethoscope },
    { title: "Pacientes", path: "/admin/pacientes", icon: Users },
  ],
  MEDICO: [
    { title: "Dashboard Médico", path: "/medico", icon: LayoutDashboard },
    { title: "Consultas", path: "/medico/consultas", icon: Calendar },
  ],
  ATENDENTE: [
    {
      title: "Painel de Atendimento",
      path: "/atendente",
      icon: LayoutDashboard,
    },
    { title: "Agendamentos", path: "/atendente/agendamentos", icon: Calendar },
  ],
  PACIENTE: [
    { title: "Meu Painel", path: "/paciente", icon: LayoutDashboard },
    { title: "Minhas Consultas", path: "/paciente/consultas", icon: UserRound },
  ],
};
