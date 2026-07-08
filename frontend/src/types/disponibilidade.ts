export type DiaSemana =
  | "DOMINGO"
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO";

export interface DisponibilidadePadraoResponse {
  idDisponibilidade: number;
  idMedico: number;
  dataInicio: string; // ISO date
  dataFim: string | null;
  horarioInicio: string; // "HH:mm:ss"
  horarioFim: string;
  diaSemana: DiaSemana;
  duracaoConsulta: number;
}

export interface DisponibilidadePadraoRequest {
  idMedico: number;
  dataInicio: string;
  dataFim?: string | null;
  horarioInicio: string;
  horarioFim: string;
  diaSemana: DiaSemana;
  duracaoConsulta: number;
}
