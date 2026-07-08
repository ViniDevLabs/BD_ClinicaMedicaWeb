import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CalendarPlus,
  CalendarX,
  Eye,
  RotateCcw,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { agendamentoService } from "@/services/agendamento/agendamentoService";
import { medicoService } from "@/services/medico/medicoService";
import type { AgendamentoResponse } from "@/types/agendamento";
import { formatarDataHoraBr } from "@/lib/formatters";
import { statusAgendamentoBadge } from "@/lib/statusBadge";

interface MedicoInfo {
  nome: string;
  especialidades: string[];
}

const ATIVOS = ["AGENDADO", "CONFIRMADO"];

export function MinhasConsultas() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [medicos, setMedicos] = useState<Map<number, MedicoInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [consultaParaCancelar, setConsultaParaCancelar] =
    useState<AgendamentoResponse | null>(null);

  const carregar = async () => {
    if (!usuario) return;
    try {
      setLoading(true);
      const [consultas, listaMedicos] = await Promise.all([
        agendamentoService.listarPorPaciente(usuario.id),
        medicoService.listar(),
      ]);
      setAgendamentos(consultas);
      setMedicos(
        new Map(
          listaMedicos.map((m) => [
            m.id,
            { nome: m.nome, especialidades: m.especialidades },
          ]),
        ),
      );
    } catch {
      toast.error("Não foi possível carregar suas consultas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const { proximas, historico } = useMemo(() => {
    const agora = Date.now();
    const ehProxima = (c: AgendamentoResponse) =>
      ATIVOS.includes(c.status) && new Date(c.dataHora).getTime() >= agora;

    const proximas = agendamentos
      .filter(ehProxima)
      .sort(
        (a, b) =>
          new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime(),
      );
    const historico = agendamentos
      .filter((c) => !ehProxima(c))
      .sort(
        (a, b) =>
          new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime(),
      );
    return { proximas, historico };
  }, [agendamentos]);

  const confirmarCancelamento = async () => {
    if (!consultaParaCancelar) return;
    try {
      await agendamentoService.cancelar(consultaParaCancelar.idAgendamento);
      toast.success("Consulta cancelada e horário liberado.");
      setAgendamentos((prev) =>
        prev.map((c) =>
          c.idAgendamento === consultaParaCancelar.idAgendamento
            ? { ...c, status: "CANCELADO" }
            : c,
        ),
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.erro || "Não foi possível cancelar a consulta.",
      );
    } finally {
      setConsultaParaCancelar(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Minhas Consultas
          </h2>
          <p className="text-slate-500">
            Acompanhe seus agendamentos e histórico de atendimentos.
          </p>
        </div>
        <Button
          onClick={() => navigate("/paciente/agendar")}
          className="gap-2 shrink-0"
        >
          <CalendarPlus size={16} /> Agendar consulta
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : agendamentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <div className="rounded-full bg-slate-100 p-3 text-slate-500">
              <Stethoscope size={24} />
            </div>
            <p className="font-medium text-slate-900">
              Você ainda não possui consultas
            </p>
            <Button
              onClick={() => navigate("/paciente/agendar")}
              className="mt-1 gap-2"
            >
              <CalendarPlus size={16} /> Agendar a primeira
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Secao titulo="Próximas" vazio="Nenhuma consulta futura agendada.">
            {proximas.map((c) => (
              <ConsultaCard
                key={c.idAgendamento}
                consulta={c}
                medico={medicos.get(c.medico.idMedico)}
                onDetalhes={() =>
                  navigate(`/paciente/consultas/${c.idAgendamento}`)
                }
                onCancelar={() => setConsultaParaCancelar(c)}
                onRetorno={() =>
                  navigate(`/paciente/agendar?retornoDe=${c.idAgendamento}`)
                }
              />
            ))}
          </Secao>

          <Secao titulo="Histórico" vazio="Nenhum atendimento anterior.">
            {historico.map((c) => (
              <ConsultaCard
                key={c.idAgendamento}
                consulta={c}
                medico={medicos.get(c.medico.idMedico)}
                onDetalhes={() =>
                  navigate(`/paciente/consultas/${c.idAgendamento}`)
                }
                onCancelar={() => setConsultaParaCancelar(c)}
                onRetorno={() =>
                  navigate(`/paciente/agendar?retornoDe=${c.idAgendamento}`)
                }
              />
            ))}
          </Secao>
        </div>
      )}

      <AlertDialog
        open={!!consultaParaCancelar}
        onOpenChange={(open) => !open && setConsultaParaCancelar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar consulta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta consulta? O horário será
              liberado na agenda do médico e esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarCancelamento}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancelar consulta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Secao({
  titulo,
  vazio,
  children,
}: {
  titulo: string;
  vazio: string;
  children: React.ReactNode[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
        {titulo}
      </h3>
      {children.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
          {vazio}
        </p>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );
}

function ConsultaCard({
  consulta,
  medico,
  onDetalhes,
  onCancelar,
  onRetorno,
}: {
  consulta: AgendamentoResponse;
  medico?: MedicoInfo;
  onDetalhes: () => void;
  onCancelar: () => void;
  onRetorno: () => void;
}) {
  const badge = statusAgendamentoBadge[consulta.status];
  const podeCancelar = ATIVOS.includes(consulta.status);
  const podeRetornar = consulta.status === "REALIZADO";

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Stethoscope size={20} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-slate-900">
                {medico?.nome ?? `Médico #${consulta.medico.idMedico}`}
              </p>
              <Badge className={badge.className}>{badge.label}</Badge>
              {consulta.idAgendamentoPai && (
                <Badge className="bg-slate-100 text-slate-600">Retorno</Badge>
              )}
            </div>
            <p className="text-sm text-slate-500">
              {medico?.especialidades.join(", ") || "Consulta médica"}
            </p>
            <p className="text-sm font-medium text-slate-700">
              {formatarDataHoraBr(consulta.dataHora)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDetalhes}
            className="gap-1.5"
          >
            <Eye size={15} /> Detalhes
          </Button>
          {podeRetornar && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetorno}
              className="gap-1.5"
            >
              <RotateCcw size={15} /> Retorno
            </Button>
          )}
          {podeCancelar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelar}
              className="gap-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              <CalendarX size={15} /> Cancelar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
