export type StatusAgendamento =
  | "AGENDADO"
  | "CONFIRMADO"
  | "REALIZADO"
  | "CANCELADO";

export interface AgendamentoResponse {
  idAgendamento: number;
  paciente: {
    idPaciente: number;
    nome: string;
    cpf: string;
  };
  atendente: {
    idAtendente: number;
    nome: string;
  } | null;
  medico: {
    idMedico: number;
    nome: string;
    especialidades: string[];
  };
  idAgendamentoPai: number | null;
  dataHora: string; // ISO LocalDateTime, ex.: "2026-07-10T14:30:00"
  status: StatusAgendamento;
}

export interface AgendamentoRequest {
  idPaciente: number;
  idAtendente?: number | null;
  idMedico: number;
  idAgendamentoPai?: number | null;
  dataHora: string;
  status?: StatusAgendamento;
}
