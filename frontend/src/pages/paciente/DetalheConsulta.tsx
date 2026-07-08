import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FileText, Stethoscope, ClipboardList, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { agendamentoService } from "@/services/agendamento/agendamentoService";
import { medicoService } from "@/services/medico/medicoService";
import { prontuarioService } from "@/services/prontuario/prontuarioService";
import { exameService } from "@/services/exame/exameService";
import type { AgendamentoResponse } from "@/types/agendamento";
import type { ProntuarioResponse } from "@/types/prontuario";
import type { ExameResponse } from "@/types/exame";
import type { MedicoResponse } from "@/services/medico/medicoService";
import { formatarDataHoraBr, formatarDataIsoParaBr } from "@/lib/formatters";
import { statusAgendamentoBadge, statusExameBadge } from "@/lib/statusBadge";

export function DetalheConsulta() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [consulta, setConsulta] = useState<AgendamentoResponse | null>(null);
  const [medico, setMedico] = useState<MedicoResponse | null>(null);
  const [prontuario, setProntuario] = useState<ProntuarioResponse | null>(null);
  const [exames, setExames] = useState<ExameResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const agendamento = await agendamentoService.buscarPorId(Number(id));
        setConsulta(agendamento);

        const [dadosMedico, dadosProntuario, dadosExames] = await Promise.all([
          medicoService.buscarPorId(agendamento.idMedico).catch(() => null),
          prontuarioService.buscarPorAgendamento(agendamento.idAgendamento),
          exameService.listarPorAgendamento(agendamento.idAgendamento),
        ]);
        setMedico(dadosMedico);
        setProntuario(dadosProntuario);
        setExames(dadosExames);
      } catch {
        toast.error("Não foi possível carregar a consulta.");
        navigate("/paciente/consultas");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  if (!consulta) return null;

  const badge = statusAgendamentoBadge[consulta.status];

  return (
    <div className="max-w-3xl space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/paciente" />}>
              Meu Resumo
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/paciente/consultas" />}>
              Minhas Consultas
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detalhes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho da consulta */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <Stethoscope size={22} />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-900">
                {medico?.nome ?? `Médico #${consulta.idMedico}`}
              </p>
              <p className="text-sm text-slate-500">
                {medico?.especialidades.join(", ") || "Consulta médica"}
              </p>
              <p className="text-sm font-medium text-slate-700">
                {formatarDataHoraBr(consulta.dataHora)}
              </p>
            </div>
          </div>
          <Badge className={badge.className}>{badge.label}</Badge>
        </CardContent>
      </Card>

      {/* Prontuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-slate-900">
            <ClipboardList size={18} className="text-slate-500" />
            Prontuário Clínico
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prontuario ? (
            <div className="space-y-4">
              <CampoProntuario titulo="Diagnóstico" valor={prontuario.diagnostico} />
              <CampoProntuario titulo="Prescrição" valor={prontuario.prescricao} />
              <CampoProntuario
                titulo="Observações médicas"
                valor={prontuario.registroObservacoes}
              />
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              O prontuário desta consulta ainda não foi registrado pelo médico.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Exames */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-slate-900">
            <FlaskConical size={18} className="text-slate-500" />
            Exames
          </CardTitle>
        </CardHeader>
        <CardContent>
          {exames.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum exame solicitado nesta consulta.
            </p>
          ) : (
            <div className="space-y-3">
              {exames.map((exame) => {
                const badgeExame = statusExameBadge[exame.status];
                return (
                  <div
                    key={exame.idExame}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-slate-900">
                        {exame.nomeExame}
                      </p>
                      <Badge className={badgeExame.className}>
                        {badgeExame.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {exame.localRealizacao === "INTERNO"
                        ? "Realização interna"
                        : "Realização externa"}{" "}
                      · Solicitado em{" "}
                      {formatarDataIsoParaBr(exame.dataSolicitacao)}
                    </p>
                    {exame.observacoesMedicas && (
                      <p className="mt-2 text-sm text-slate-600">
                        {exame.observacoesMedicas}
                      </p>
                    )}
                    {exame.arquivoLaudoPath && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                        <FileText size={15} className="text-slate-400" />
                        <span className="truncate">
                          {exame.arquivoLaudoPath}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CampoProntuario({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string | null;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {titulo}
      </p>
      <p className="mt-1 text-sm text-slate-700">
        {valor || <span className="text-slate-400">Não informado</span>}
      </p>
    </div>
  );
}
