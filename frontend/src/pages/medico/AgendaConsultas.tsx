import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CalendarDays,
  CheckCircle2,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { agendamentoService } from "@/services/agendamento/agendamentoService";
import { pacienteService } from "@/services/paciente/pacienteService";
import type { AgendamentoResponse } from "@/types/agendamento";
import { formatarHora, hojeISO } from "@/lib/formatters";
import { statusAgendamentoBadge } from "@/lib/statusBadge";

export function AgendaConsultas() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [pacientes, setPacientes] = useState<Map<number, string>>(new Map());
  const [data, setData] = useState(hojeISO());
  const [loading, setLoading] = useState(true);
  const [consultaParaRealizar, setConsultaParaRealizar] =
    useState<AgendamentoResponse | null>(null);

  useEffect(() => {
    if (!usuario) return;

    async function carregar() {
      try {
        setLoading(true);
        const [consultas, listaPacientes] = await Promise.all([
          agendamentoService.listarPorMedico(usuario!.id),
          pacienteService.listar().catch(() => []),
        ]);
        setAgendamentos(consultas);
        setPacientes(new Map(listaPacientes.map((p) => [p.id, p.nome])));
      } catch {
        toast.error("Não foi possível carregar a agenda.");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [usuario]);

  const consultasDoDia = useMemo(
    () =>
      agendamentos
        .filter((c) => c.dataHora.slice(0, 10) === data)
        .sort(
          (a, b) =>
            new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime(),
        ),
    [agendamentos, data],
  );

  const confirmarRealizacao = async () => {
    if (!consultaParaRealizar) return;
    try {
      const atualizada = await agendamentoService.realizar(
        consultaParaRealizar.idAgendamento,
      );
      toast.success("Consulta marcada como realizada.");
      setAgendamentos((prev) =>
        prev.map((c) =>
          c.idAgendamento === atualizada.idAgendamento ? atualizada : c,
        ),
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.erro || "Não foi possível realizar a consulta.",
      );
    } finally {
      setConsultaParaRealizar(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Fila de Atendimento
        </h2>
        <p className="text-slate-500">
          Acompanhe os pacientes agendados e conduza os atendimentos do dia.
        </p>
      </div>

      <div className="flex items-end gap-3">
        <div className="max-w-xs space-y-2">
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setData(hojeISO())}
          className="gap-2"
        >
          <CalendarDays size={16} /> Hoje
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : consultasDoDia.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <div className="rounded-full bg-slate-100 p-3 text-slate-500">
              <CalendarDays size={24} />
            </div>
            <p className="font-medium text-slate-900">
              Nenhuma consulta nesta data
            </p>
            <p className="text-sm text-slate-500">
              Selecione outro dia para visualizar a agenda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {consultasDoDia.map((c) => {
            const badge = statusAgendamentoBadge[c.status];
            const podeRealizar = c.status === "CONFIRMADO";
            return (
              <Card key={c.idAgendamento}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <span className="text-sm font-semibold">
                        {formatarHora(c.dataHora.slice(11))}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">
                          {pacientes.get(c.paciente.idPaciente) ??
                            `Paciente #${c.paciente.idPaciente}`}
                        </p>
                        <Badge className={badge.className}>{badge.label}</Badge>
                        {c.idAgendamentoPai && (
                          <Badge className="bg-slate-100 text-slate-600">
                            Retorno
                          </Badge>
                        )}
                      </div>
                      <p className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Stethoscope size={14} /> Consulta médica
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/medico/consultas/${c.idAgendamento}`)
                      }
                      className="gap-1.5"
                    >
                      <ClipboardList size={15} /> Atender
                    </Button>
                    {podeRealizar && (
                      <Button
                        size="sm"
                        onClick={() => setConsultaParaRealizar(c)}
                        className="gap-1.5"
                      >
                        <CheckCircle2 size={15} /> Realizar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={!!consultaParaRealizar}
        onOpenChange={(open) => !open && setConsultaParaRealizar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Concluir atendimento</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmar que o atendimento desta consulta foi realizado? O status
              passará para "Realizado".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarRealizacao}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
