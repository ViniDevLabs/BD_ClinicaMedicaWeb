import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function RootRedirect() {
  const { usuario } = useAuth();

  if (!usuario || usuario.perfis.length === 0) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.perfis.includes("ADMINISTRADOR"))
    return <Navigate to="/admin" replace />;

  if (usuario.perfis.includes("MEDICO"))
    return <Navigate to="/medico" replace />;

  if (usuario.perfis.includes("ATENDENTE"))
    return <Navigate to="/atendente" replace />;

  if (usuario.perfis.includes("PACIENTE"))
    return <Navigate to="/paciente" replace />;

  return <Navigate to="/forbidden" replace />;
}
