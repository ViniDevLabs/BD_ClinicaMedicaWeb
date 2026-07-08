import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Stethoscope,
  Check,
  Clock,
  RotateCcw,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import { agendamentoService } from "@/services/agendamento/agendamentoService";
import { medicoService } from "@/services/medico/medicoService";
import type { MedicoResponse } from "@/services/medico/medicoService";
import { formatarHora } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const TODOS = "TODOS";

export function AgendarConsulta() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const retornoDe = searchParams.get("retornoDe");

  const [medicos, setMedicos] = useState<MedicoResponse[]>([]);
  const [loadingMedicos, setLoadingMedicos] = useState(true);

  const [busca, setBusca] = useState("");
  const [especialidade, setEspecialidade] = useState<string>(TODOS);
  const [medicoSelecionado, setMedicoSelecionado] =
    useState<MedicoResponse | null>(null);

  const [data, setData] = useState("");
  const [horarios, setHorarios] = useState<string[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [horario, setHorario] = useState<string | null>(null);

  const [salvando, setSalvando] = useState(false);

  const hoje = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function carregar() {
      try {
        const lista = await medicoService.listar();
        setMedicos(lista);

        if (retornoDe) {
          const original = await agendamentoService.buscarPorId(
            Number(retornoDe),
          );
          const medico = lista.find((m) => m.id === original.idMedico);
          if (medico) setMedicoSelecionado(medico);
        }
      } catch {
        toast.error("Não foi possível carregar os médicos disponíveis.");
      } finally {
        setLoadingMedicos(false);
      }
    }
    carregar();
  }, [retornoDe]);

  const especialidades = useMemo(() => {
    const set = new Set<string>();
    medicos.forEach((m) => m.especialidades.forEach((e) => set.add(e)));
    return Array.from(set).sort();
  }, [medicos]);

  const medicosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase();
    return medicos.filter((m) => {
      const combinaBusca = m.nome.toLowerCase().includes(termo);
      const combinaEsp =
        especialidade === TODOS || m.especialidades.includes(especialidade);
      return combinaBusca && combinaEsp;
    });
  }, [medicos, busca, especialidade]);

  useEffect(() => {
    if (!medicoSelecionado || !data) {
      setHorarios([]);
      setHorario(null);
      return;
    }

    let ativo = true;
    setLoadingHorarios(true);
    setHorario(null);

    agendamentoService
      .listarHorariosDisponiveis(medicoSelecionado.id, data)
      .then((slots) => ativo && setHorarios(slots))
      .catch(() => {
        if (ativo) {
          setHorarios([]);
          toast.error("Erro ao buscar horários disponíveis.");
        }
      })
      .finally(() => ativo && setLoadingHorarios(false));

    return () => {
      ativo = false;
    };
  }, [medicoSelecionado, data]);

  const selecionarMedico = (medico: MedicoResponse) => {
    setMedicoSelecionado(medico);
    setData("");
    setHorarios([]);
    setHorario(null);
  };

  const confirmar = async () => {
    if (!usuario || !medicoSelecionado || !data || !horario) return;

    setSalvando(true);
    try {
      await agendamentoService.criar({
        idPaciente: usuario.id,
        idMedico: medicoSelecionado.id,
        idAgendamentoPai: retornoDe ? Number(retornoDe) : null,
        dataHora: `${data}T${horario}`,
        status: "AGENDADO",
      });
      toast.success(
        retornoDe
          ? "Consulta de retorno agendada com sucesso!"
          : "Consulta agendada com sucesso!",
      );
      navigate("/paciente/consultas");
    } catch (error: any) {
      toast.error(
        error.response?.data?.erro || "Não foi possível concluir o agendamento.",
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {retornoDe ? "Agendar Retorno" : "Agendar Consulta"}
        </h2>
        <p className="text-slate-500">
          Escolha o profissional, a data e o horário disponível.
        </p>
      </div>

      {retornoDe && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
          <RotateCcw size={18} className="shrink-0" />
          <p className="text-sm">
            Esta será uma <strong>consulta de retorno</strong>, vinculada à
            consulta original.
          </p>
        </div>
      )}

      {/* Etapa 1: Médico */}
      <section className="space-y-4">
        <StepTitle numero={1} titulo="Selecione o profissional" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar por nome..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FiltroEspecialidade
              ativo={especialidade === TODOS}
              onClick={() => setEspecialidade(TODOS)}
            >
              Todas
            </FiltroEspecialidade>
            {especialidades.map((esp) => (
              <FiltroEspecialidade
                key={esp}
                ativo={especialidade === esp}
                onClick={() => setEspecialidade(esp)}
              >
                {esp}
              </FiltroEspecialidade>
            ))}
          </div>
        </div>

        {loadingMedicos ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        ) : medicosFiltrados.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhum médico encontrado com esses filtros.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {medicosFiltrados.map((medico) => {
              const selecionado = medicoSelecionado?.id === medico.id;
              return (
                <button
                  key={medico.id}
                  type="button"
                  onClick={() => selecionarMedico(medico)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border bg-white p-4 text-left transition-all",
                    selecionado
                      ? "border-slate-900 ring-1 ring-slate-900"
                      : "border-slate-200 hover:border-slate-400",
                  )}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <Stethoscope size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {medico.nome}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {medico.especialidades.join(", ") || "Clínico"}
                    </p>
                  </div>
                  {selecionado && (
                    <Check size={18} className="shrink-0 text-slate-900" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Etapa 2: Data e horário */}
      {medicoSelecionado && (
        <section className="space-y-4">
          <StepTitle numero={2} titulo="Escolha a data e o horário" />
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="max-w-xs space-y-2">
                <Label htmlFor="data">Data da consulta</Label>
                <Input
                  id="data"
                  type="date"
                  min={hoje}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>

              {data && (
                <div className="space-y-2">
                  <Label>Horários disponíveis</Label>
                  {loadingHorarios ? (
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-20 rounded-lg" />
                      ))}
                    </div>
                  ) : horarios.length === 0 ? (
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                      <Clock size={16} />
                      Nenhum horário disponível nesta data. Tente outro dia.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {horarios.map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setHorario(h)}
                          className={cn(
                            "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                            horario === h
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 text-slate-700 hover:border-slate-400",
                          )}
                        >
                          {formatarHora(h)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button
          onClick={confirmar}
          disabled={!horario || salvando}
          className="gap-2"
        >
          <CalendarCheck size={16} />
          {salvando ? "Confirmando..." : "Confirmar agendamento"}
        </Button>
      </div>
    </div>
  );
}

function StepTitle({ numero, titulo }: { numero: number; titulo: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        {numero}
      </span>
      <h3 className="text-lg font-semibold text-slate-900">{titulo}</h3>
    </div>
  );
}

function FiltroEspecialidade({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors",
        ativo
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 text-slate-600 hover:border-slate-400",
      )}
    >
      {children}
    </button>
  );
}
