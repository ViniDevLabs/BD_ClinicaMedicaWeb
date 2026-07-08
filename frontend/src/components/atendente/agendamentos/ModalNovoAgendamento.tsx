import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/hooks/useAuth";
import { agendamentoService } from "@/services/agendamento/agendamentoService";
import type { AgendamentoResponse } from "@/types/agendamento";
import type { PacienteResponse } from "@/types/paciente";
import type { MedicoResponse } from "@/types/medico";

import { SeletorPaciente } from "./SeletorPaciente";
import { SeletorMedico } from "./SeletorMedico";

interface ModalNovoAgendamentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacientes: PacienteResponse[];
  medicos: MedicoResponse[];
  agendamentoPai: AgendamentoResponse | null;
  onSucesso: () => void;
  onNovoPaciente: () => void;
}

export function ModalNovoAgendamento({
  open,
  onOpenChange,
  pacientes,
  medicos,
  agendamentoPai,
  onSucesso,
  onNovoPaciente,
}: ModalNovoAgendamentoProps) {
  const { usuario } = useAuth();
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState<PacienteResponse | null>(null);
  const [medicoSelecionado, setMedicoSelecionado] =
    useState<MedicoResponse | null>(null);
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horaAgendamento, setHoraAgendamento] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [buscandoHorarios, setBuscandoHorarios] = useState(false);

  const ehRetorno = !!agendamentoPai;

  useEffect(() => {
    if (open && ehRetorno && agendamentoPai) {
      const pac =
        pacientes.find((p) => p.id === agendamentoPai.paciente.idPaciente) ||
        null;
      const med =
        medicos.find((m) => m.id === agendamentoPai.medico.idMedico) || null;
      setPacienteSelecionado(pac);
      setMedicoSelecionado(med);
    }
  }, [open, ehRetorno, agendamentoPai, pacientes, medicos]);

  const resetFormulario = () => {
    setPacienteSelecionado(null);
    setMedicoSelecionado(null);
    setDataAgendamento("");
    setHoraAgendamento("");
    setHorariosDisponiveis([]);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetFormulario();
  };

  const buscarHorariosDisponiveis = async () => {
    if (!medicoSelecionado || !dataAgendamento) {
      toast.error("Selecione um médico e uma data.");
      return;
    }

    try {
      setBuscandoHorarios(true);
      const horarios = await agendamentoService.listarHorariosDisponiveis(
        medicoSelecionado.id,
        dataAgendamento,
      );
      setHorariosDisponiveis(horarios);
      if (horarios.length === 0) {
        toast.info("Não há horários disponíveis para a data selecionada.");
      }
    } catch (error) {
      toast.error("Erro ao buscar horários disponíveis.");
    } finally {
      setBuscandoHorarios(false);
    }
  };

  const handleCriarAgendamento = async () => {
    if (
      !pacienteSelecionado ||
      !medicoSelecionado ||
      !dataAgendamento ||
      !horaAgendamento
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const horaFormatada = horaAgendamento.substring(0, 5);
      const dataHora = `${dataAgendamento}T${horaFormatada}:00`;

      await agendamentoService.criar({
        idPaciente: pacienteSelecionado.id,
        idMedico: medicoSelecionado.id,
        idAtendente: usuario?.id ?? null,
        idAgendamentoPai: agendamentoPai?.idAgendamento || null,
        dataHora,
        status: "AGENDADO",
      });

      toast.success("Agendamento criado com sucesso!");
      onSucesso();
      handleClose();
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao criar agendamento.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ehRetorno ? "Agendar Consulta de Retorno" : "Novo Agendamento"}
          </DialogTitle>
          <DialogDescription>
            {ehRetorno
              ? "Agende uma consulta de retorno para este paciente."
              : "Preencha os dados para criar um novo agendamento."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {ehRetorno && agendamentoPai && (
            <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
              <p className="text-sm text-slate-600">
                <strong>Consulta Original:</strong>{" "}
                {format(
                  parseISO(agendamentoPai.dataHora),
                  "dd/MM/yyyy 'às' HH:mm",
                  { locale: ptBR },
                )}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Médico:</strong> {agendamentoPai.medico.nome}
              </p>
            </div>
          )}

          {!ehRetorno && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Paciente *</Label>
                <SeletorPaciente
                  pacientes={pacientes}
                  selecionado={pacienteSelecionado}
                  onSelect={setPacienteSelecionado}
                  onNovoPaciente={onNovoPaciente}
                />
              </div>

              <div className="space-y-2">
                <Label>Médico *</Label>
                <SeletorMedico
                  medicos={medicos}
                  selecionado={medicoSelecionado}
                  onSelect={setMedicoSelecionado}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Input
                type="date"
                value={dataAgendamento}
                onChange={(e) => setDataAgendamento(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Hora *</Label>
              <div className="flex gap-2">
                <Select
                  value={horaAgendamento}
                  onValueChange={(value) => setHoraAgendamento(value ?? "")}
                  disabled={horariosDisponiveis.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {horariosDisponiveis.map((hora) => (
                      <SelectItem key={hora} value={hora}>
                        {hora}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={buscarHorariosDisponiveis}
                  disabled={
                    !medicoSelecionado || !dataAgendamento || buscandoHorarios
                  }
                >
                  <Search size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleCriarAgendamento}>
            {ehRetorno ? "Agendar Retorno" : "Criar Agendamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
