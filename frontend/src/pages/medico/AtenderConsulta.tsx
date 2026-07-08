import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  User,
  ClipboardList,
  FlaskConical,
  FileText,
  History,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { agendamentoService } from "@/services/agendamento/agendamentoService";
import { pacienteService } from "@/services/paciente/pacienteService";
import {
  prontuarioService,
  type ProntuarioRequest,
} from "@/services/prontuario/prontuarioService";
import { exameService } from "@/services/exame/exameService";
import type { AgendamentoResponse } from "@/types/agendamento";
import type { PacienteResponse } from "@/types/paciente";
import type { ProntuarioResponse } from "@/types/prontuario";
import type { ExameResponse } from "@/types/exame";
import {
  formatarCPF,
  formatarDataHoraBr,
  formatarDataIsoParaBr,
  hojeISO,
} from "@/lib/formatters";
import { statusAgendamentoBadge, statusExameBadge } from "@/lib/statusBadge";

const SELECT_CLASS =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const prontuarioSchema = z.object({
  diagnostico: z.string().min(3, "Descreva o diagnóstico"),
  prescricao: z.string().optional(),
  registroObservacoes: z.string().optional(),
});
type ProntuarioForm = z.infer<typeof prontuarioSchema>;

const exameSchema = z.object({
  nomeExame: z.string().min(3, "Informe o nome do exame"),
  localRealizacao: z.enum(["INTERNO", "EXTERNO"]),
  dataSolicitacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  observacoesMedicas: z.string().optional(),
});
type ExameForm = z.infer<typeof exameSchema>;

export function AtenderConsulta() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [consulta, setConsulta] = useState<AgendamentoResponse | null>(null);
  const [paciente, setPaciente] = useState<PacienteResponse | null>(null);
  const [prontuario, setProntuario] = useState<ProntuarioResponse | null>(null);
  const [exames, setExames] = useState<ExameResponse[]>([]);
  const [historico, setHistorico] = useState<AgendamentoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormExame, setMostrarFormExame] = useState(false);
  const [confirmarRealizar, setConfirmarRealizar] = useState(false);

  const prontuarioForm = useForm<ProntuarioForm>({
    resolver: zodResolver(prontuarioSchema),
    defaultValues: { diagnostico: "", prescricao: "", registroObservacoes: "" },
  });

  const exameForm = useForm<ExameForm>({
    resolver: zodResolver(exameSchema),
    defaultValues: {
      nomeExame: "",
      localRealizacao: "INTERNO",
      dataSolicitacao: hojeISO(),
      observacoesMedicas: "",
    },
  });

  useEffect(() => {
    async function carregar() {
      try {
        const agendamento = await agendamentoService.buscarPorId(Number(id));
        setConsulta(agendamento);

        const [dadosPaciente, dadosProntuario, dadosExames, consultasPaciente] =
          await Promise.all([
            pacienteService.buscarPorId(agendamento.idPaciente).catch(() => null),
            prontuarioService.buscarPorAgendamento(agendamento.idAgendamento),
            exameService.listarPorAgendamento(agendamento.idAgendamento),
            agendamentoService
              .listarPorPaciente(agendamento.idPaciente)
              .catch(() => []),
          ]);

        setPaciente(dadosPaciente);
        setExames(dadosExames);
        setHistorico(
          consultasPaciente.filter(
            (c) =>
              c.status === "REALIZADO" &&
              c.idAgendamento !== agendamento.idAgendamento,
          ),
        );

        if (dadosProntuario) {
          setProntuario(dadosProntuario);
          prontuarioForm.reset({
            diagnostico: dadosProntuario.diagnostico ?? "",
            prescricao: dadosProntuario.prescricao ?? "",
            registroObservacoes: dadosProntuario.registroObservacoes ?? "",
          });
        }
      } catch {
        toast.error("Não foi possível carregar a consulta.");
        navigate("/medico/consultas");
      } finally {
        setLoading(false);
      }
    }
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const salvarProntuario = async (dados: ProntuarioForm) => {
    if (!consulta) return;
    const payload: ProntuarioRequest = {
      idAgendamento: consulta.idAgendamento,
      diagnostico: dados.diagnostico,
      prescricao: dados.prescricao || null,
      registroObservacoes: dados.registroObservacoes || null,
    };
    try {
      const salvo = prontuario
        ? await prontuarioService.atualizar(prontuario.idProntuario, payload)
        : await prontuarioService.criar(payload);
      setProntuario(salvo);
      toast.success("Prontuário registrado com sucesso.");
    } catch (error: any) {
      toast.error(
        error.response?.data?.erro || "Não foi possível salvar o prontuário.",
      );
    }
  };

  const solicitarExame = async (dados: ExameForm) => {
    if (!consulta) return;
    try {
      const novo = await exameService.criar({
        idAgendamento: consulta.idAgendamento,
        nomeExame: dados.nomeExame,
        localRealizacao: dados.localRealizacao,
        dataSolicitacao: dados.dataSolicitacao,
        observacoesMedicas: dados.observacoesMedicas || null,
      });
      setExames((prev) => [...prev, novo]);
      exameForm.reset({
        nomeExame: "",
        localRealizacao: "INTERNO",
        dataSolicitacao: hojeISO(),
        observacoesMedicas: "",
      });
      setMostrarFormExame(false);
      toast.success("Exame solicitado com sucesso.");
    } catch (error: any) {
      toast.error(
        error.response?.data?.erro || "Não foi possível solicitar o exame.",
      );
    }
  };

  const concluirExame = async (idExame: number) => {
    try {
      const atualizado = await exameService.concluir(idExame);
      setExames((prev) =>
        prev.map((e) => (e.idExame === idExame ? atualizado : e)),
      );
      toast.success("Exame concluído.");
    } catch (error: any) {
      toast.error(
        error.response?.data?.erro || "Não foi possível concluir o exame.",
      );
    }
  };

  const realizarConsulta = async () => {
    if (!consulta) return;
    try {
      const atualizada = await agendamentoService.realizar(
        consulta.idAgendamento,
      );
      setConsulta(atualizada);
      toast.success("Consulta marcada como realizada.");
    } catch (error: any) {
      toast.error(
        error.response?.data?.erro || "Não foi possível realizar a consulta.",
      );
    } finally {
      setConfirmarRealizar(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
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
            <BreadcrumbLink render={<Link to="/medico" />}>
              Painel
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/medico/consultas" />}>
              Agenda
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Atendimento</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho do paciente */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <User size={22} />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-900">
                {paciente?.nome ?? `Paciente #${consulta.idPaciente}`}
              </p>
              <p className="text-sm text-slate-500">
                CPF {paciente ? formatarCPF(paciente.cpf) : "-"}
                {paciente?.convenio ? ` · ${paciente.convenio}` : ""}
              </p>
              <p className="text-sm font-medium text-slate-700">
                {formatarDataHoraBr(consulta.dataHora)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Badge className={badge.className}>{badge.label}</Badge>
            {consulta.status === "CONFIRMADO" && (
              <Button
                size="sm"
                onClick={() => setConfirmarRealizar(true)}
                className="gap-1.5"
              >
                <CheckCircle2 size={15} /> Realizar consulta
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Histórico do paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-slate-900">
            <History size={18} className="text-slate-500" />
            Histórico do paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <p className="text-sm text-slate-500">
              Sem atendimentos anteriores registrados.
            </p>
          ) : (
            <div className="space-y-2">
              {historico.map((h) => (
                <Link
                  key={h.idAgendamento}
                  to={`/medico/consultas/${h.idAgendamento}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:border-slate-400"
                >
                  <span className="text-sm text-slate-700">
                    {formatarDataHoraBr(h.dataHora)}
                  </span>
                  <Badge className={statusAgendamentoBadge[h.status].className}>
                    {statusAgendamentoBadge[h.status].label}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
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
          <form
            onSubmit={prontuarioForm.handleSubmit(salvarProntuario)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Diagnóstico</Label>
              <textarea
                rows={2}
                className={`${SELECT_CLASS} h-auto`}
                {...prontuarioForm.register("diagnostico")}
              />
              {prontuarioForm.formState.errors.diagnostico && (
                <span className="text-sm text-red-500">
                  {prontuarioForm.formState.errors.diagnostico.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label>Prescrição</Label>
              <textarea
                rows={2}
                className={`${SELECT_CLASS} h-auto`}
                {...prontuarioForm.register("prescricao")}
              />
            </div>
            <div className="space-y-2">
              <Label>Observações médicas</Label>
              <textarea
                rows={2}
                className={`${SELECT_CLASS} h-auto`}
                {...prontuarioForm.register("registroObservacoes")}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={prontuarioForm.formState.isSubmitting}
              >
                {prontuario ? "Atualizar prontuário" : "Registrar prontuário"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Exames */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base text-slate-900">
            <FlaskConical size={18} className="text-slate-500" />
            Exames
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMostrarFormExame((v) => !v)}
            className="gap-1.5"
          >
            <Plus size={15} /> Solicitar exame
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {mostrarFormExame && (
            <form
              onSubmit={exameForm.handleSubmit(solicitarExame)}
              className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Nome do exame</Label>
                  <Input
                    placeholder="Ex: Hemograma completo"
                    {...exameForm.register("nomeExame")}
                  />
                  {exameForm.formState.errors.nomeExame && (
                    <span className="text-sm text-red-500">
                      {exameForm.formState.errors.nomeExame.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Local de realização</Label>
                  <select
                    className={SELECT_CLASS}
                    {...exameForm.register("localRealizacao")}
                  >
                    <option value="INTERNO">Interno</option>
                    <option value="EXTERNO">Externo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Data de solicitação</Label>
                  <Input type="date" {...exameForm.register("dataSolicitacao")} />
                  {exameForm.formState.errors.dataSolicitacao && (
                    <span className="text-sm text-red-500">
                      {exameForm.formState.errors.dataSolicitacao.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Observações (opcional)</Label>
                  <Input
                    placeholder="Instruções ou observações"
                    {...exameForm.register("observacoesMedicas")}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMostrarFormExame(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={exameForm.formState.isSubmitting}>
                  Solicitar
                </Button>
              </div>
            </form>
          )}

          {exames.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum exame solicitado nesta consulta.
            </p>
          ) : (
            exames.map((exame) => {
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
                    <div className="flex items-center gap-2">
                      <Badge className={badgeExame.className}>
                        {badgeExame.label}
                      </Badge>
                      {exame.status === "LAUDO_ANEXADO" && (
                        <Button
                          size="sm"
                          onClick={() => concluirExame(exame.idExame)}
                          className="gap-1.5"
                        >
                          <CheckCircle2 size={14} /> Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {exame.localRealizacao === "INTERNO"
                      ? "Realização interna"
                      : "Realização externa"}{" "}
                    · Solicitado em {formatarDataIsoParaBr(exame.dataSolicitacao)}
                  </p>
                  {exame.observacoesMedicas && (
                    <p className="mt-2 text-sm text-slate-600">
                      {exame.observacoesMedicas}
                    </p>
                  )}
                  {exame.arquivoLaudoPath && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                      <FileText size={15} className="text-slate-400" />
                      <span className="truncate">{exame.arquivoLaudoPath}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={confirmarRealizar}
        onOpenChange={(open) => !open && setConfirmarRealizar(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Concluir atendimento</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmar que este atendimento foi realizado? O status passará para
              "Realizado".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={realizarConsulta}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
