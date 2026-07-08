export type StatusExame =
  | "SOLICITADO"
  | "CANCELADO"
  | "LAUDO_ANEXADO"
  | "CONCLUIDO";

export type LocalRealizacaoExame = "INTERNO" | "EXTERNO";

export interface ExameResponse {
  idExame: number;
  idAgendamento: number;
  nomeExame: string;
  dataSolicitacao: string; // ISO date, ex.: "2026-07-10"
  localRealizacao: LocalRealizacaoExame;
  observacoesMedicas: string | null;
  arquivoLaudoPath: string | null;
  status: StatusExame;
}
