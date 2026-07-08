import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FileText, FlaskConical, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { exameService } from "@/services/exame/exameService";
import type { AgendamentoResponse } from "@/types/agendamento";
import type { ExameResponse } from "@/types/exame";
import { formatarDataIsoParaBr } from "@/lib/formatters";
import { statusExameBadge } from "@/lib/statusBadge";

interface ModalExamesAgendamentoProps {
  agendamento: AgendamentoResponse | null;
  onOpenChange: (open: boolean) => void;
}

export function ModalExamesAgendamento({
  agendamento,
  onOpenChange,
}: ModalExamesAgendamentoProps) {
  const [exames, setExames] = useState<ExameResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!agendamento) return;
    let ativo = true;
    setLoading(true);
    exameService
      .listarPorAgendamento(agendamento.idAgendamento)
      .then((data) => ativo && setExames(data))
      .catch(() => ativo && toast.error("Erro ao carregar exames."))
      .finally(() => ativo && setLoading(false));
    return () => {
      ativo = false;
    };
  }, [agendamento]);

  const aoAnexar = (atualizado: ExameResponse) => {
    setExames((prev) =>
      prev.map((e) => (e.idExame === atualizado.idExame ? atualizado : e)),
    );
  };

  return (
    <Dialog open={!!agendamento} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Exames do paciente</DialogTitle>
          <DialogDescription>
            {agendamento
              ? `Anexe laudos físicos em nome de ${agendamento.paciente.nome}.`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {loading ? (
            <>
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </>
          ) : exames.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <div className="rounded-full bg-slate-100 p-3 text-slate-500">
                <FlaskConical size={22} />
              </div>
              <p className="text-sm text-slate-500">
                Nenhum exame solicitado para esta consulta.
              </p>
            </div>
          ) : (
            exames.map((exame) => (
              <ExameItem key={exame.idExame} exame={exame} onAnexado={aoAnexar} />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExameItem({
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
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-slate-900">{exame.nomeExame}</p>
        <Badge className={badge.className}>{badge.label}</Badge>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {exame.localRealizacao === "INTERNO"
          ? "Realização interna"
          : "Realização externa"}{" "}
        · Solicitado em {formatarDataIsoParaBr(exame.dataSolicitacao)}
      </p>
      {exame.arquivoLaudoPath && (
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
          <FileText size={15} className="text-slate-400" />
          <span className="truncate">{exame.arquivoLaudoPath}</span>
        </div>
      )}
      {podeAnexar && (
        <div className="mt-3">
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
    </div>
  );
}
