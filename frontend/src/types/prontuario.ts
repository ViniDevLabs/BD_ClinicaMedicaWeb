export interface ProntuarioResponse {
  idProntuario: number;
  idAgendamento: number;
  diagnostico: string | null;
  prescricao: string | null;
  registroObservacoes: string | null;
}
