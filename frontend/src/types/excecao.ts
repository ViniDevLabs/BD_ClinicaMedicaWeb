export type TipoExcecao = "BLOQUEIO" | "ADICAO";

export interface ExcecaoAgendaResponse {
  idExcecao: number;
  idMedico: number;
  dataExcecao: string; // ISO date
  tipoExcecao: TipoExcecao;
  horarioInicio: string | null; // "HH:mm:ss"
  horarioFim: string | null;
}

export interface ExcecaoAgendaRequest {
  idMedico: number;
  dataExcecao: string;
  tipoExcecao: TipoExcecao;
  horarioInicio?: string | null;
  horarioFim?: string | null;
}
