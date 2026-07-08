import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, FlaskConical, Upload } from "lucide-react";
import { toast } from "sonner";
import { agendamentoService } from "@/services/agendamento/agendamentoService";
import { exameService } from "@/services/exame/exameService";
import type { ExameResponse } from "@/types/exame";
import { formatarDataIsoParaBr } from "@/lib/formatters";
import { statusExameBadge } from "@/lib/statusBadge";

export function ResultadosExames() {
  const { usuario } = useAuth();
  const [exames, setExames] = useState<ExameResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuario) return;

    async function carregar() {
      try {
        const consultas = await agendamentoService.listarPorPaciente(
          usuario!.id,
        );
        const listas = await Promise.all(
          consultas.map((c) =>
            exameService.listarPorAgendamento(c.idAgendamento),
          ),
        );
        const todos = listas
          .flat()
          .sort(
            (a, b) =>
              new Date(b.dataSolicitacao).getTime() -
              new Date(a.dataSolicitacao).getTime(),
          );
        setExames(todos);
      } catch {
        toast.error("Não foi possível carregar seus exames.");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [usuario]);

  const aoAnexar = (atualizado: ExameResponse) => {
    setExames((prev) =>
      prev.map((e) => (e.idExame === atualizado.idExame ? atualizado : e)),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Resultados de Exames
        </h2>
        <p className="text-slate-500">
          Acompanhe seus exames e anexe os laudos solicitados.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      ) : exames.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <div className="rounded-full bg-slate-100 p-3 text-slate-500">
              <FlaskConical size={24} />
            </div>
            <p className="font-medium text-slate-900">Nenhum exame por aqui</p>
            <p className="text-sm text-slate-500">
              Seus exames solicitados em consultas aparecerão nesta página.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {exames.map((exame) => (
            <ExameCard key={exame.idExame} exame={exame} onAnexado={aoAnexar} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExameCard({
  exame,
  onAnexado,
}: {
  exame: ExameResponse;
  onAnexado: (exame: ExameResponse) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const badge = statusExameBadge[exame.status];
  const podeAnexar = exame.status === "SOLICITADO";

  const selecionarArquivo = async (
    evento: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;

    setEnviando(true);
    try {
      const atualizado = await exameService.anexarLaudo(
        exame.idExame,
        arquivo.name,
      );
      toast.success("Laudo anexado com sucesso!");
      onAnexado(atualizado);
    } catch (error: any) {
      toast.error(
        error.response?.data?.erro || "Não foi possível anexar o laudo.",
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <FlaskConical size={20} />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-slate-900">{exame.nomeExame}</p>
              <Badge className={badge.className}>{badge.label}</Badge>
            </div>
            <p className="text-sm text-slate-500">
              {exame.localRealizacao === "INTERNO"
                ? "Realização interna"
                : "Realização externa"}{" "}
              · Solicitado em {formatarDataIsoParaBr(exame.dataSolicitacao)}
            </p>
            {exame.arquivoLaudoPath && (
              <div className="flex items-center gap-2 pt-1 text-sm text-slate-700">
                <FileText size={15} className="text-slate-400" />
                <span className="truncate">{exame.arquivoLaudoPath}</span>
              </div>
            )}
          </div>
        </div>

        {podeAnexar && (
          <div className="shrink-0">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={selecionarArquivo}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={enviando}
              className="gap-1.5"
            >
              <Upload size={15} />
              {enviando ? "Enviando..." : "Anexar laudo"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
