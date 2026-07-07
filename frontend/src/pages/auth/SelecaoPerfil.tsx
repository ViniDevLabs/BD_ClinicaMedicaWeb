import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getRolePath } from "@/routes/RootRedirect";
import { Stethoscope, Users, LayoutDashboard, UserRound } from "lucide-react";
import type { Role } from "@/types/usuario";

const ROLE_CONFIG: Record<Role, { title: string; icon: React.ElementType }> = {
  ADMINISTRADOR: { title: "Administração", icon: LayoutDashboard },
  MEDICO: { title: "Portal do Médico", icon: Stethoscope },
  ATENDENTE: { title: "Atendimento", icon: Users },
  PACIENTE: { title: "Área do Paciente", icon: UserRound },
};

export function SelecaoPerfil() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.perfis.length === 1) return <Navigate to="/" replace />;

  return (
    <div className="h-full flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Bem-vindo, {usuario.nome}
          </h1>
          <p className="text-slate-500 mt-2">
            Você possui múltiplos acessos. Selecione qual área deseja entrar
            agora:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {usuario.perfis.map((perfil) => {
            const config = ROLE_CONFIG[perfil];
            return (
              <Card
                key={perfil}
                className="hover:border-slate-400 cursor-pointer transition-colors"
                onClick={() => navigate(getRolePath(perfil))}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
                    <config.icon size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{config.title}</CardTitle>
                    <CardDescription>
                      Acessar painel como {perfil.toLowerCase()}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
