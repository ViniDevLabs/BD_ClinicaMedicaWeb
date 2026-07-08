import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Stethoscope, UserCog, Calendar } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { medicoService } from "@/services/medico/medicoService";
import { pacienteService } from "@/services/paciente/pacienteService";
import { agendamentoService } from "@/services/agendamento/agendamentoService";
import { hojeISO } from "@/lib/formatters";

interface Metricas {
  pacientes: number;
  medicos: number;
  atendentes: number;
  consultasHoje: number;
}

export function DashboardAdmin() {
  const [metricas, setMetricas] = useState<Metricas | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const [pacientes, medicos, atendentes, agendamentos] =
          await Promise.all([
            pacienteService.listar(),
            medicoService.listar(),
            api.get<unknown[]>("/atendentes").then((r) => r.data),
            agendamentoService.listar(),
          ]);

        const hoje = hojeISO();
        setMetricas({
          pacientes: pacientes.length,
          medicos: medicos.length,
          atendentes: atendentes.length,
          consultasHoje: agendamentos.filter(
            (a) => a.dataHora.slice(0, 10) === hoje && a.status !== "CANCELADO",
          ).length,
        });
      } catch {
        toast.error("Não foi possível carregar as métricas.");
      }
    }
    carregar();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h2>
        <p className="text-slate-500">
          Visão geral do sistema da clínica médica.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricaCard
          titulo="Total de Pacientes"
          valor={metricas?.pacientes}
          descricao="Pacientes cadastrados"
          icon={Users}
        />
        <MetricaCard
          titulo="Corpo Clínico"
          valor={metricas?.medicos}
          descricao="Médicos ativos"
          icon={Stethoscope}
        />
        <MetricaCard
          titulo="Equipe de Atendimento"
          valor={metricas?.atendentes}
          descricao="Atendentes ativos"
          icon={UserCog}
        />
        <MetricaCard
          titulo="Consultas Hoje"
          valor={metricas?.consultasHoje}
          descricao="Agendadas para hoje"
          icon={Calendar}
        />
      </div>
    </div>
  );
}

function MetricaCard({
  titulo,
  valor,
  descricao,
  icon: Icon,
}: {
  titulo: string;
  valor: number | undefined;
  descricao: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
        <Icon className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        {valor === undefined ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{valor}</div>
        )}
        <p className="text-xs text-slate-500">{descricao}</p>
      </CardContent>
    </Card>
  );
}
