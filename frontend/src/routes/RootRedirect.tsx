import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types/usuario";

export const getRolePath = (role: Role) => {
  switch (role) {
    case "ADMINISTRADOR":
      return "/admin";
    case "MEDICO":
      return "/medico";
    case "ATENDENTE":
      return "/atendente";
    case "PACIENTE":
      return "/paciente";
    default:
      return "/forbidden";
  }
};

export function RootRedirect() {
  const { usuario } = useAuth();

  if (!usuario || usuario.perfis.length === 0) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.perfis.length > 1) {
    return <Navigate to="/selecionar-perfil" replace />;
  }

  return <Navigate to={getRolePath(usuario.perfis[0])} replace />;
}
