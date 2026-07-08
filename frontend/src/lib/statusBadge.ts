import type { StatusAgendamento } from "@/types/agendamento";
import type { StatusExame } from "@/types/exame";

interface BadgeInfo {
  label: string;
  className: string;
}

export const statusAgendamentoBadge: Record<StatusAgendamento, BadgeInfo> = {
  AGENDADO: { label: "Agendado", className: "bg-blue-100 text-blue-700" },
  CONFIRMADO: {
    label: "Confirmado",
    className: "bg-emerald-100 text-emerald-700",
  },
  REALIZADO: { label: "Realizado", className: "bg-slate-200 text-slate-700" },
  CANCELADO: { label: "Cancelado", className: "bg-red-100 text-red-600" },
};

export const statusExameBadge: Record<StatusExame, BadgeInfo> = {
  SOLICITADO: { label: "Solicitado", className: "bg-amber-100 text-amber-700" },
  LAUDO_ANEXADO: {
    label: "Laudo Anexado",
    className: "bg-blue-100 text-blue-700",
  },
  CONCLUIDO: { label: "Concluído", className: "bg-emerald-100 text-emerald-700" },
  CANCELADO: { label: "Cancelado", className: "bg-red-100 text-red-600" },
};
