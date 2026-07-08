import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarPlus,
  CalendarClock,
  CheckCircle2,
  FlaskConical,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { agendamentoService } from "@/services/agendamento/agendamentoService";
import { exameService } from "@/services/exame/exameService";
import { medicoService } from "@/services/medico/medicoService";
import type { AgendamentoResponse } from "@/types/agendamento";
import { formatarDataHoraBr } from "@/lib/formatters";
import { statusAgendamentoBadge } from "@/lib/statusBadge";

interface MedicoInfo {
  nome: string;
  especialidades: string[];
}

const ATIVOS = ["AGENDADO", "CONFIRMADO"];

export function DashboardPaciente() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [medicos, setMedicos] = useState<Map<number, MedicoInfo>>(new Map());
  const [examesPendentes, setExamesPendentes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuario) return;

    async function carregar() {
      try {
        const [consultas, listaMedicos] = await Promise.all([
          agendamentoService.listarPorPaciente(usuario!.id),
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

        const exames = await Promise.all(
          consultas.map((c) =>
            exameService.listarPorAgendamento(c.idAgendamento),
          ),
        );
        setExamesPendentes(
          exames.flat().filter((e) => e.status === "SOLICITADO").length,
        );
      } catch {
        toast.error("Não foi possível carregar seu resumo.");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [usuario]);

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

  const totalProximas = useMemo(() => {
    const agora = Date.now();
    return agendamentos.filter(
      (c) =>
        ATIVOS.includes(c.status) && new Date(c.dataHora).getTime() >= agora,
    ).length;
  }, [agendamentos]);

  const totalRealizadas = useMemo(
    () => agendamentos.filter((c) => c.status === "REALIZADO").length,
    [agendamentos],
  );

  const primeiroNome = usuario?.nome.split(" ")[0] ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Olá, {primeiroNome}
          </h2>
          <p className="text-slate-500">
            Este é o resumo da sua jornada de cuidado.
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
                      Sua próxima consulta
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">
                      {medicos.get(proximaConsulta.idMedico)?.nome ??
                        `Médico #${proximaConsulta.idMedico}`}
                    </p>
                    <p className="text-slate-300">
                      {medicos
                        .get(proximaConsulta.idMedico)
                        ?.especialidades.join(", ") || "Consulta médica"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-medium text-slate-100">
                      {formatarDataHoraBr(proximaConsulta.dataHora)}
                    </span>
                    <Badge
                      className={
                        statusAgendamentoBadge[proximaConsulta.status].className
                      }
                    >
                      {statusAgendamentoBadge[proximaConsulta.status].label}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/paciente/consultas/${proximaConsulta.idAgendamento}`,
                    )
                  }
                  className="gap-2 border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
                >
                  Ver detalhes <ArrowRight size={16} />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                <div className="rounded-full bg-slate-100 p-3 text-slate-500">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    Você não tem consultas futuras
                  </p>
                  <p className="text-sm text-slate-500">
                    Agende um atendimento com um de nossos especialistas.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/paciente/agendar")}
                  className="mt-2 gap-2"
                >
                  <CalendarPlus size={16} /> Agendar agora
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              titulo="Próximas consultas"
              valor={totalProximas}
              icon={CalendarClock}
            />
            <KpiCard
              titulo="Consultas realizadas"
              valor={totalRealizadas}
              icon={CheckCircle2}
            />
            <KpiCard
              titulo="Exames aguardando laudo"
              valor={examesPendentes}
              icon={FlaskConical}
            />
          </div>
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
