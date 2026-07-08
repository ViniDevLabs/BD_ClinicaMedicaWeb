import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldAlert size={48} className="text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            403
          </h1>
          <h2 className="text-2xl font-semibold text-slate-700">
            Acesso Restrito
          </h2>
          <p className="text-slate-500">
            Você não possui o nível de permissão necessário para visualizar o
            conteúdo desta área do sistema.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar à tela anterior
          </Button>
          <Button onClick={() => navigate("/")}>Ir para o início</Button>
        </div>
      </div>
    </div>
  );
}
