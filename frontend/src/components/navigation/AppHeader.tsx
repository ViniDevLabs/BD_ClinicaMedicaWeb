import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeftRight } from "lucide-react";

export function AppHeader() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!usuario) return null;

  const possuiMultiplosPerfis = usuario.perfis.length > 1;
  const estaNaTelaDeSelecao = location.pathname === "/selecionar-perfil";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-lg">+</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Clínica Médica
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500 hidden md:inline-block">
          Olá,{" "}
          <strong className="text-slate-700">
            {usuario.nome.split(" ")[0]}
          </strong>
        </span>

        {possuiMultiplosPerfis && !estaNaTelaDeSelecao && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/selecionar-perfil")}
            className="gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeftRight size={16} />
            <span className="hidden sm:inline">Trocar Perfil</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
    </header>
  );
}
