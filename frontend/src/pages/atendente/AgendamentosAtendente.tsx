import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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

import { agendamentoService } from "@/services/agendamento/agendamentoService";
import { pacienteService } from "@/services/paciente/pacienteService";
import { medicoService } from "@/services/medico/medicoService";

import type { AgendamentoResponse } from "@/types/agendamento";
import type { PacienteResponse } from "@/types/paciente";
import type { MedicoResponse } from "@/types/medico";

import { FiltrosAgendamento } from "@/components/atendente/agendamentos/FiltrosAgendamento";
import { TabelaAgendamentos } from "@/components/atendente/agendamentos/TabelaAgendamentos";
import { ModalNovoAgendamento } from "@/components/atendente/agendamentos/ModalNovoAgendamento";
import { ModalNovoPaciente } from "@/components/atendente/agendamentos/ModalNovoPaciente";

export function AgendamentosAtendente() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [dataFiltro, setDataFiltro] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [buscaPaciente, setBuscaPaciente] = useState("");
  const [buscaMedico, setBuscaMedico] = useState("");

  // Modais
  const [modalNovoAgendamento, setModalNovoAgendamento] = useState(false);
  const [modalNovoPaciente, setModalNovoPaciente] = useState(false);

  // Dados para retorno
  const [agendamentoPai, setAgendamentoPai] =
    useState<AgendamentoResponse | null>(null);

  // Dados base
  const [pacientes, setPacientes] = useState<PacienteResponse[]>([]);
  const [medicos, setMedicos] = useState<MedicoResponse[]>([]);

  // Confirmação de cancelamento
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] =
    useState<AgendamentoResponse | null>(null);

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      const data = await agendamentoService.listar();

      let filtrados = data;

      if (dataFiltro) {
        filtrados = filtrados.filter((ag) =>
          ag.dataHora.startsWith(dataFiltro),
        );
      }

      if (buscaPaciente) {
        filtrados = filtrados.filter((ag) =>
          ag.paciente.nome.toLowerCase().includes(buscaPaciente.toLowerCase()),
        );
      }

      if (buscaMedico) {
        filtrados = filtrados.filter((ag) =>
          ag.medico.nome.toLowerCase().includes(buscaMedico.toLowerCase()),
        );
      }

      const ordenados = filtrados.sort(
        (a, b) =>
          new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime(),
      );

      setAgendamentos(ordenados);
    } catch (error) {
      toast.error("Erro ao carregar agendamentos.");
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosBase = async () => {
    try {
      const [pacientesData, medicosData] = await Promise.all([
        pacienteService.listar(),
        medicoService.listar(),
      ]);
      setPacientes(pacientesData);
      setMedicos(medicosData);
    } catch (error) {
      toast.error("Erro ao carregar dados de pacientes e médicos.");
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, [dataFiltro, buscaPaciente, buscaMedico]);

  useEffect(() => {
    carregarDadosBase();
  }, []);

  const abrirModalCancelar = (agendamento: AgendamentoResponse) => {
    setAgendamentoParaCancelar(agendamento);
  };

  const confirmarCancelamento = async () => {
    if (!agendamentoParaCancelar) return;

    try {
      await agendamentoService.cancelar(agendamentoParaCancelar.idAgendamento);
      toast.success("Agendamento cancelado com sucesso!");
      carregarAgendamentos();
    } catch (error: any) {
      toast.error(
        error.response?.data?.erro || "Erro ao cancelar agendamento.",
      );
    } finally {
      setAgendamentoParaCancelar(null);
    }
  };

  const handleConfirmarCheckIn = async (id: number) => {
    try {
      await agendamentoService.confirmarCheckIn(id);
      toast.success("Check-in realizado com sucesso!");
      carregarAgendamentos();
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao realizar check-in.");
    }
  };

  const abrirModalAgendarRetorno = (agendamento: AgendamentoResponse) => {
    setAgendamentoPai(agendamento);
    setModalNovoAgendamento(true);
  };

  const fecharModalAgendamento = () => {
    setModalNovoAgendamento(false);
    setAgendamentoPai(null);
  };

  const abrirModalNovoPaciente = () => {
    setModalNovoPaciente(true);
  };

  const handlePacienteCadastrado = () => {
    carregarDadosBase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Controle de Agendamentos
          </h2>
          <p className="text-slate-500">
            Gerencie todos os agendamentos da clínica
          </p>
        </div>
        <Button
          onClick={() => {
            setAgendamentoPai(null);
            setModalNovoAgendamento(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <FiltrosAgendamento
        dataFiltro={dataFiltro}
        buscaPaciente={buscaPaciente}
        buscaMedico={buscaMedico}
        onFiltroDataChange={setDataFiltro}
        onBuscaPacienteChange={setBuscaPaciente}
        onBuscaMedicoChange={setBuscaMedico}
      />

      <TabelaAgendamentos
        agendamentos={agendamentos}
        loading={loading}
        onCheckIn={handleConfirmarCheckIn}
        onCancelar={abrirModalCancelar}
        onAgendarRetorno={abrirModalAgendarRetorno}
      />

      <ModalNovoAgendamento
        open={modalNovoAgendamento}
        onOpenChange={(open) => {
          if (!open) fecharModalAgendamento();
        }}
        pacientes={pacientes}
        medicos={medicos}
        agendamentoPai={agendamentoPai}
        onSucesso={carregarAgendamentos}
        onNovoPaciente={abrirModalNovoPaciente}
      />

      <ModalNovoPaciente
        open={modalNovoPaciente}
        onOpenChange={setModalNovoPaciente}
        onSucesso={handlePacienteCadastrado}
      />

      <AlertDialog
        open={!!agendamentoParaCancelar}
        onOpenChange={(open) => !open && setAgendamentoParaCancelar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar a consulta do paciente{" "}
              <strong>{agendamentoParaCancelar?.paciente.nome}</strong> com o
              médico <strong>{agendamentoParaCancelar?.medico.nome}</strong>?
              <br />
              <br />
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Manter Agendamento</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarCancelamento}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancelar Consulta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
