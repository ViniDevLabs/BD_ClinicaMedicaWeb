import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  ArrowRight,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { agendamentoService } from "@/services/agendamento/agendamentoService";
import type { AgendamentoResponse } from "@/types/agendamento";
import { formatarHora, hojeISO } from "@/lib/formatters";
import { statusAgendamentoBadge } from "@/lib/statusBadge";

export function DashboardAtendente() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setAgendamentos(await agendamentoService.listar());
      } catch {
        toast.error("Não foi possível carregar o painel.");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const hoje = hojeISO();

  const doDia = useMemo(
    () => agendamentos.filter((a) => a.dataHora.slice(0, 10) === hoje),
    [agendamentos, hoje],
  );

  const aguardandoCheckIn = doDia.filter((a) => a.status === "AGENDADO");
  const confirmados = doDia.filter((a) => a.status === "CONFIRMADO");

  const primeiroNome = usuario?.nome.split(" ")[0] ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Painel de Atendimento
          </h2>
          <p className="text-slate-500">
            Olá, {primeiroNome}. Acompanhe o fluxo da clínica hoje.
          </p>
        </div>
        <Button
          onClick={() => navigate("/atendente/agendamentos")}
          className="gap-2 shrink-0"
        >
          <CalendarDays size={16} /> Controle de Agendamentos
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard titulo="Agendados hoje" valor={doDia.length} icon={CalendarDays} />
            <KpiCard
              titulo="Aguardando check-in"
              valor={aguardandoCheckIn.length}
              icon={Clock}
            />
            <KpiCard
              titulo="Check-in realizado"
              valor={confirmados.length}
              icon={CheckCircle2}
            />
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                <Users size={18} className="text-slate-500" />
                Aguardando check-in
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/atendente/agendamentos")}
                className="gap-1.5"
              >
                Ver todos <ArrowRight size={14} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {aguardandoCheckIn.length === 0 ? (
                <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                  Nenhum paciente aguardando check-in no momento.
                </p>
              ) : (
                aguardandoCheckIn
                  .sort(
                    (a, b) =>
                      new Date(a.dataHora).getTime() -
                      new Date(b.dataHora).getTime(),
                  )
                  .map((a) => {
                    const badge = statusAgendamentoBadge[a.status];
                    return (
                      <div
                        key={a.idAgendamento}
                        className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-medium text-slate-700">
                            {formatarHora(a.dataHora.slice(11))}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {a.paciente.nome}
                            </p>
                            <p className="text-xs text-slate-500">
                              {a.medico.nome}
                            </p>
                          </div>
                        </div>
                        <Badge className={badge.className}>{badge.label}</Badge>
                      </div>
                    );
                  })
              )}
            </CardContent>
          </Card>
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
