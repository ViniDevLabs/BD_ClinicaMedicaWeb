import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-slate-200 rounded-full flex items-center justify-center">
            <FileQuestion size={48} className="text-slate-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-slate-700">
            Página não encontrada
          </h2>
          <p className="text-slate-500">
            O endereço que você tentou acessar não existe, foi movido ou a URL
            foi digitada incorretamente.
          </p>
        </div>

        <div className="pt-4">
          <Button onClick={() => navigate("/")} className="w-full sm:w-auto">
            Voltar para o início
          </Button>
        </div>
      </div>
    </div>
  );
}
