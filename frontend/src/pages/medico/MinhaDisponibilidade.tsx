import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Pencil, Trash2, Clock, CalendarOff } from "lucide-react";
import { toast } from "sonner";
import { disponibilidadeService } from "@/services/disponibilidade/disponibilidadeService";
import { excecaoService } from "@/services/excecao/excecaoService";
import type { DisponibilidadePadraoResponse } from "@/types/disponibilidade";
import type { ExcecaoAgendaResponse } from "@/types/excecao";
import { formatarDataIsoParaBr, formatarHora } from "@/lib/formatters";
import { DIAS_SEMANA, diaSemanaLabel, tipoExcecaoLabel } from "@/lib/labels";

const SELECT_CLASS =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function MinhaDisponibilidade() {
  const { usuario } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Minha Disponibilidade
        </h2>
        <p className="text-slate-500">
          Defina sua grade padrão de horários e configure exceções pontuais.
        </p>
      </div>

      {usuario && (
        <>
          <DisponibilidadeSecao idMedico={usuario.id} />
          <ExcecaoSecao idMedico={usuario.id} />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Disponibilidade Padrão                                             */
/* ------------------------------------------------------------------ */

const disponibilidadeSchema = z.object({
  diaSemana: z.enum([
    "DOMINGO",
    "SEGUNDA",
    "TERCA",
    "QUARTA",
    "QUINTA",
    "SEXTA",
    "SABADO",
  ]),
  dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  dataFim: z.string().optional(),
  horarioInicio: z.string().min(1, "Obrigatório"),
  horarioFim: z.string().min(1, "Obrigatório"),
  duracaoConsulta: z.number({ message: "Obrigatório" }).positive("Inválido"),
});
type DisponibilidadeForm = z.infer<typeof disponibilidadeSchema>;

function DisponibilidadeSecao({ idMedico }: { idMedico: number }) {
  const [itens, setItens] = useState<DisponibilidadePadraoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [paraExcluir, setParaExcluir] =
    useState<DisponibilidadePadraoResponse | null>(null);

  const form = useForm<DisponibilidadeForm>({
    resolver: zodResolver(disponibilidadeSchema),
    defaultValues: {
      diaSemana: "SEGUNDA",
      dataInicio: "",
      dataFim: "",
      horarioInicio: "08:00",
      horarioFim: "17:00",
      duracaoConsulta: 30,
    },
  });

  const carregar = async () => {
    try {
      setLoading(true);
      setItens(await disponibilidadeService.listarPorMedico(idMedico));
    } catch {
      toast.error("Erro ao carregar disponibilidades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idMedico]);

  const abrirNovo = () => {
    setEditandoId(null);
    form.reset({
      diaSemana: "SEGUNDA",
      dataInicio: "",
      dataFim: "",
      horarioInicio: "08:00",
      horarioFim: "17:00",
      duracaoConsulta: 30,
    });
    setMostrarForm(true);
  };

  const abrirEdicao = (item: DisponibilidadePadraoResponse) => {
    setEditandoId(item.idDisponibilidade);
    form.reset({
      diaSemana: item.diaSemana,
      dataInicio: item.dataInicio,
      dataFim: item.dataFim ?? "",
      horarioInicio: formatarHora(item.horarioInicio),
      horarioFim: formatarHora(item.horarioFim),
      duracaoConsulta: item.duracaoConsulta,
    });
    setMostrarForm(true);
  };

  const salvar = async (dados: DisponibilidadeForm) => {
    const payload = {
      idMedico,
      diaSemana: dados.diaSemana,
      dataInicio: dados.dataInicio,
      dataFim: dados.dataFim || null,
      horarioInicio: dados.horarioInicio,
      horarioFim: dados.horarioFim,
      duracaoConsulta: dados.duracaoConsulta,
    };
    try {
      if (editandoId) {
        await disponibilidadeService.atualizar(editandoId, payload);
        toast.success("Disponibilidade atualizada.");
      } else {
        await disponibilidadeService.criar(payload);
        toast.success("Disponibilidade criada.");
      }
      setMostrarForm(false);
      carregar();
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao salvar disponibilidade.");
    }
  };

  const confirmarExclusao = async () => {
    if (!paraExcluir) return;
    try {
      await disponibilidadeService.excluir(paraExcluir.idDisponibilidade);
      toast.success("Disponibilidade removida.");
      setItens((prev) =>
        prev.filter((i) => i.idDisponibilidade !== paraExcluir.idDisponibilidade),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao remover.");
    } finally {
      setParaExcluir(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <Clock size={18} className="text-slate-500" />
          Disponibilidade Padrão
        </CardTitle>
        <Button variant="outline" size="sm" onClick={abrirNovo} className="gap-1.5">
          <Plus size={15} /> Nova
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {mostrarForm && (
          <form
            onSubmit={form.handleSubmit(salvar)}
            className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Dia da semana</Label>
                <select className={SELECT_CLASS} {...form.register("diaSemana")}>
                  {DIAS_SEMANA.map((d) => (
                    <option key={d} value={d}>
                      {diaSemanaLabel[d]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Duração da consulta (min)</Label>
                <Input
                  type="number"
                  {...form.register("duracaoConsulta", { valueAsNumber: true })}
                />
                {form.formState.errors.duracaoConsulta && (
                  <span className="text-sm text-red-500">
                    {form.formState.errors.duracaoConsulta.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Horário início</Label>
                <Input type="time" {...form.register("horarioInicio")} />
              </div>
              <div className="space-y-2">
                <Label>Horário fim</Label>
                <Input type="time" {...form.register("horarioFim")} />
              </div>
              <div className="space-y-2">
                <Label>Vigência início</Label>
                <Input type="date" {...form.register("dataInicio")} />
                {form.formState.errors.dataInicio && (
                  <span className="text-sm text-red-500">
                    {form.formState.errors.dataInicio.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Vigência fim (opcional)</Label>
                <Input type="date" {...form.register("dataFim")} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMostrarForm(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Salvar
              </Button>
            </div>
          </form>
        )}

        {loading ? (
          <Skeleton className="h-16 rounded-lg" />
        ) : itens.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhuma disponibilidade cadastrada.
          </p>
        ) : (
          itens.map((item) => (
            <div
              key={item.idDisponibilidade}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-slate-900 text-white">
                    {diaSemanaLabel[item.diaSemana]}
                  </Badge>
                  <span className="text-sm font-medium text-slate-700">
                    {formatarHora(item.horarioInicio)} –{" "}
                    {formatarHora(item.horarioFim)}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Consultas de {item.duracaoConsulta} min · vigência{" "}
                  {formatarDataIsoParaBr(item.dataInicio)}
                  {item.dataFim ? ` a ${formatarDataIsoParaBr(item.dataFim)}` : ""}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => abrirEdicao(item)}
                  className="text-slate-500 hover:text-blue-600"
                >
                  <Pencil size={17} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setParaExcluir(item)}
                  className="text-slate-500 hover:text-red-600"
                >
                  <Trash2 size={17} />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <AlertDialog
        open={!!paraExcluir}
        onOpenChange={(open) => !open && setParaExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover disponibilidade</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta faixa de disponibilidade?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarExclusao}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Exceções de Agenda                                                 */
/* ------------------------------------------------------------------ */

const excecaoSchema = z.object({
  tipoExcecao: z.enum(["BLOQUEIO", "ADICAO"]),
  dataExcecao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  horarioInicio: z.string().optional(),
  horarioFim: z.string().optional(),
});
type ExcecaoForm = z.infer<typeof excecaoSchema>;

function ExcecaoSecao({ idMedico }: { idMedico: number }) {
  const [itens, setItens] = useState<ExcecaoAgendaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [paraExcluir, setParaExcluir] = useState<ExcecaoAgendaResponse | null>(
    null,
  );

  const form = useForm<ExcecaoForm>({
    resolver: zodResolver(excecaoSchema),
    defaultValues: {
      tipoExcecao: "BLOQUEIO",
      dataExcecao: "",
      horarioInicio: "",
      horarioFim: "",
    },
  });

  const carregar = async () => {
    try {
      setLoading(true);
      setItens(await excecaoService.listarPorMedico(idMedico));
    } catch {
      toast.error("Erro ao carregar exceções.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idMedico]);

  const abrirNovo = () => {
    setEditandoId(null);
    form.reset({
      tipoExcecao: "BLOQUEIO",
      dataExcecao: "",
      horarioInicio: "",
      horarioFim: "",
    });
    setMostrarForm(true);
  };

  const abrirEdicao = (item: ExcecaoAgendaResponse) => {
    setEditandoId(item.idExcecao);
    form.reset({
      tipoExcecao: item.tipoExcecao,
      dataExcecao: item.dataExcecao,
      horarioInicio: item.horarioInicio ? formatarHora(item.horarioInicio) : "",
      horarioFim: item.horarioFim ? formatarHora(item.horarioFim) : "",
    });
    setMostrarForm(true);
  };

  const salvar = async (dados: ExcecaoForm) => {
    const payload = {
      idMedico,
      tipoExcecao: dados.tipoExcecao,
      dataExcecao: dados.dataExcecao,
      horarioInicio: dados.horarioInicio || null,
      horarioFim: dados.horarioFim || null,
    };
    try {
      if (editandoId) {
        await excecaoService.atualizar(editandoId, payload);
        toast.success("Exceção atualizada.");
      } else {
        await excecaoService.criar(payload);
        toast.success("Exceção criada.");
      }
      setMostrarForm(false);
      carregar();
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao salvar exceção.");
    }
  };

  const confirmarExclusao = async () => {
    if (!paraExcluir) return;
    try {
      await excecaoService.excluir(paraExcluir.idExcecao);
      toast.success("Exceção removida.");
      setItens((prev) =>
        prev.filter((i) => i.idExcecao !== paraExcluir.idExcecao),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao remover.");
    } finally {
      setParaExcluir(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <CalendarOff size={18} className="text-slate-500" />
          Exceções de Agenda
        </CardTitle>
        <Button variant="outline" size="sm" onClick={abrirNovo} className="gap-1.5">
          <Plus size={15} /> Nova
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {mostrarForm && (
          <form
            onSubmit={form.handleSubmit(salvar)}
            className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select className={SELECT_CLASS} {...form.register("tipoExcecao")}>
                  <option value="BLOQUEIO">Bloqueio</option>
                  <option value="ADICAO">Adição</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" {...form.register("dataExcecao")} />
                {form.formState.errors.dataExcecao && (
                  <span className="text-sm text-red-500">
                    {form.formState.errors.dataExcecao.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Horário início (opcional)</Label>
                <Input type="time" {...form.register("horarioInicio")} />
              </div>
              <div className="space-y-2">
                <Label>Horário fim (opcional)</Label>
                <Input type="time" {...form.register("horarioFim")} />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Um bloqueio sem horários bloqueia o dia inteiro. Adições exigem
              horário de início e fim.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMostrarForm(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Salvar
              </Button>
            </div>
          </form>
        )}

        {loading ? (
          <Skeleton className="h-16 rounded-lg" />
        ) : itens.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhuma exceção cadastrada.
          </p>
        ) : (
          itens.map((item) => (
            <div
              key={item.idExcecao}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      item.tipoExcecao === "BLOQUEIO"
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-emerald-700"
                    }
                  >
                    {tipoExcecaoLabel[item.tipoExcecao]}
                  </Badge>
                  <span className="text-sm font-medium text-slate-700">
                    {formatarDataIsoParaBr(item.dataExcecao)}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {item.horarioInicio && item.horarioFim
                    ? `${formatarHora(item.horarioInicio)} – ${formatarHora(item.horarioFim)}`
                    : "Dia inteiro"}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => abrirEdicao(item)}
                  className="text-slate-500 hover:text-blue-600"
                >
                  <Pencil size={17} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setParaExcluir(item)}
                  className="text-slate-500 hover:text-red-600"
                >
                  <Trash2 size={17} />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <AlertDialog
        open={!!paraExcluir}
        onOpenChange={(open) => !open && setParaExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover exceção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta exceção de agenda?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarExclusao}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
