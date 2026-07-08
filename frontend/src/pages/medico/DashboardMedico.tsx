import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  CalendarClock,
  FlaskConical,
  ClipboardCheck,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { agendamentoService } from "@/services/agendamento/agendamentoService";
import { exameService } from "@/services/exame/exameService";
import { pacienteService } from "@/services/paciente/pacienteService";
import type { AgendamentoResponse } from "@/types/agendamento";
import { formatarDataHoraBr, formatarHora, hojeISO } from "@/lib/formatters";
import { statusAgendamentoBadge } from "@/lib/statusBadge";

const ATIVOS = ["AGENDADO", "CONFIRMADO"];

export function DashboardMedico() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [pacientes, setPacientes] = useState<Map<number, string>>(new Map());
  const [examesAvaliar, setExamesAvaliar] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuario) return;

    async function carregar() {
      try {
        const [consultas, listaPacientes] = await Promise.all([
          agendamentoService.listarPorMedico(usuario!.id),
          pacienteService.listar().catch(() => []),
        ]);
        setAgendamentos(consultas);
        setPacientes(new Map(listaPacientes.map((p) => [p.id, p.nome])));

        const exames = await Promise.all(
          consultas.map((c) =>
            exameService.listarPorAgendamento(c.idAgendamento),
          ),
        );
        setExamesAvaliar(
          exames.flat().filter((e) => e.status === "LAUDO_ANEXADO").length,
        );
      } catch {
        toast.error("Não foi possível carregar o painel.");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [usuario]);

  const hoje = hojeISO();

  const consultasHoje = useMemo(
    () =>
      agendamentos.filter(
        (c) => c.dataHora.slice(0, 10) === hoje && c.status !== "CANCELADO",
      ),
    [agendamentos, hoje],
  );

  const aguardandoConfirmacao = useMemo(
    () => agendamentos.filter((c) => c.status === "AGENDADO").length,
    [agendamentos],
  );

  const proximaConsulta = useMemo(() => {
    const agora = Date.now();
    return agendamentos
      .filter(
        (c) =>
          ATIVOS.includes(c.status) && new Date(c.dataHora).getTime() >= agora,
      )
      .sort(
        (a, b) =>
          new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime(),
      )[0];
  }, [agendamentos]);

  const primeiroNome = usuario?.nome.split(" ").slice(-1)[0] ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Painel Médico
          </h2>
          <p className="text-slate-500">
            Bem-vindo(a), Dr(a). {primeiroNome}. Aqui está o seu dia.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/medico/disponibilidade")}
            className="gap-2"
          >
            <CalendarClock size={16} /> Minha disponibilidade
          </Button>
          <Button
            onClick={() => navigate("/medico/consultas")}
            className="gap-2"
          >
            <CalendarDays size={16} /> Ver agenda
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {proximaConsulta ? (
            <Card className="border-none bg-slate-900 text-white ring-0">
              <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CalendarClock size={18} />
                    <span className="text-sm font-medium uppercase tracking-wider">
                      Próximo atendimento
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">
                      {pacientes.get(proximaConsulta.paciente.idPaciente) ??
                        `Paciente #${proximaConsulta.paciente.idPaciente}`}
                    </p>
                    <p className="text-slate-300">
                      {formatarDataHoraBr(proximaConsulta.dataHora)}
                    </p>
                  </div>
                  <Badge
                    className={
                      statusAgendamentoBadge[proximaConsulta.status].className
                    }
                  >
                    {statusAgendamentoBadge[proximaConsulta.status].label}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/medico/consultas/${proximaConsulta.idAgendamento}`,
                    )
                  }
                  className="gap-2 border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
                >
                  Atender <ArrowRight size={16} />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                <div className="rounded-full bg-slate-100 p-3 text-slate-500">
                  <Stethoscope size={24} />
                </div>
                <p className="font-medium text-slate-900">
                  Nenhum atendimento agendado
                </p>
                <p className="text-sm text-slate-500">
                  Sua agenda está livre no momento.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              titulo="Consultas hoje"
              valor={consultasHoje.length}
              icon={CalendarDays}
            />
            <KpiCard
              titulo="Aguardando confirmação"
              valor={aguardandoConfirmacao}
              icon={ClipboardCheck}
            />
            <KpiCard
              titulo="Exames aguardando avaliação"
              valor={examesAvaliar}
              icon={FlaskConical}
            />
          </div>

          {consultasHoje.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-slate-900">
                  Agenda de hoje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {consultasHoje
                  .sort(
                    (a, b) =>
                      new Date(a.dataHora).getTime() -
                      new Date(b.dataHora).getTime(),
                  )
                  .map((c) => {
                    const badge = statusAgendamentoBadge[c.status];
                    return (
                      <button
                        key={c.idAgendamento}
                        type="button"
                        onClick={() =>
                          navigate(`/medico/consultas/${c.idAgendamento}`)
                        }
                        className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-slate-400"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-medium text-slate-700">
                            {formatarHora(c.dataHora.slice(11))}
                          </span>
                          <span className="text-slate-900">
                            {pacientes.get(c.paciente.idPaciente) ??
                              `Paciente #${c.paciente.idPaciente}`}
                          </span>
                        </div>
                        <Badge className={badge.className}>{badge.label}</Badge>
                      </button>
                    );
                  })}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function KpiCard({
  titulo,
  valor,
  icon: Icon,
}: {
  titulo: string;
  valor: number;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {titulo}
        </CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900">{valor}</div>
      </CardContent>
    </Card>
  );
}
