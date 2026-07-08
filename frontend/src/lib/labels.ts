import type { DiaSemana } from "@/types/disponibilidade";
import type { TipoExcecao } from "@/types/excecao";

export const diaSemanaLabel: Record<DiaSemana, string> = {
  DOMINGO: "Domingo",
  SEGUNDA: "Segunda-feira",
  TERCA: "Terça-feira",
  QUARTA: "Quarta-feira",
  QUINTA: "Quinta-feira",
  SEXTA: "Sexta-feira",
  SABADO: "Sábado",
};

export const DIAS_SEMANA: DiaSemana[] = [
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
  "DOMINGO",
];

export const tipoExcecaoLabel: Record<TipoExcecao, string> = {
  BLOQUEIO: "Bloqueio",
  ADICAO: "Adição",
};
