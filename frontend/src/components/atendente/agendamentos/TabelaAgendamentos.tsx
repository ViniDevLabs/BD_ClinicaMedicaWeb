import { CheckCircle2, XCircle, Clock, X, RefreshCw, FlaskConical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatarCPF, formatarDataHoraBr } from "@/lib/formatters";
import type {
  AgendamentoResponse,
  StatusAgendamento,
} from "@/types/agendamento";

interface TabelaAgendamentosProps {
  agendamentos: AgendamentoResponse[];
  loading: boolean;
  onCheckIn: (id: number) => void;
  onCancelar: (agendamento: AgendamentoResponse) => void;
  onAgendarRetorno: (agendamento: AgendamentoResponse) => void;
  onGerenciarExames: (agendamento: AgendamentoResponse) => void;
}

const StatusBadge = ({ status }: { status: StatusAgendamento }) => {
  switch (status) {
    case "AGENDADO":
      return (
        <Badge
          variant="outline"
          className="text-blue-600 border-blue-200 bg-blue-50"
        >
          <Clock size={12} className="mr-1" /> Aguardando
        </Badge>
      );
    case "CONFIRMADO":
      return (
        <Badge
          variant="outline"
          className="text-amber-600 border-amber-200 bg-amber-50"
        >
          <CheckCircle2 size={12} className="mr-1" /> Check-in Feito
        </Badge>
      );
    case "REALIZADO":
      return (
        <Badge
          variant="outline"
          className="text-emerald-600 border-emerald-200 bg-emerald-50"
        >
          Concluído
        </Badge>
      );
    case "CANCELADO":
      return (
        <Badge
          variant="outline"
          className="text-red-600 border-red-200 bg-red-50"
        >
          <XCircle size={12} className="mr-1" /> Cancelado
        </Badge>
      );
  }
};

export function TabelaAgendamentos({
  agendamentos,
  loading,
  onCheckIn,
  onCancelar,
  onAgendarRetorno,
  onGerenciarExames,
}: TabelaAgendamentosProps) {
  return (
    <div className="border rounded-md bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Data/Hora</TableHead>
            <TableHead>Paciente</TableHead>
            <TableHead>Médico</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Retorno</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-slate-500"
              >
                Carregando agendamentos...
              </TableCell>
            </TableRow>
          ) : agendamentos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-slate-500"
              >
                Nenhum agendamento encontrado.
              </TableCell>
            </TableRow>
          ) : (
            agendamentos.map((agendamento) => (
              <TableRow key={agendamento.idAgendamento}>
                <TableCell className="whitespace-nowrap">
                  <div className="font-semibold text-slate-900">
                    {formatarDataHoraBr(agendamento.dataHora)}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="font-medium">{agendamento.paciente.nome}</div>
                  <div className="text-xs text-slate-500">
                    CPF: {formatarCPF(agendamento.paciente.cpf)}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="font-medium">{agendamento.medico.nome}</div>
                  <div className="text-xs text-slate-500">
                    {agendamento.medico.especialidades[0]}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={agendamento.status} />
                </TableCell>
                <TableCell>
                  {agendamento.idAgendamentoPai && (
                    <Badge variant="secondary" className="text-xs">
                      <RefreshCw size={10} className="mr-1" /> Retorno
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap space-x-2">
                  {agendamento.status === "AGENDADO" && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onCheckIn(agendamento.idAgendamento)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Check-in
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAgendarRetorno(agendamento)}
                      >
                        Retorno
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onCancelar(agendamento)}
                      >
                        <X size={14} />
                      </Button>
                    </>
                  )}
                  {agendamento.status === "CONFIRMADO" && (
                    <Badge variant="secondary">Aguardando Atendimento</Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onGerenciarExames(agendamento)}
                  >
                    <FlaskConical size={14} className="mr-1" /> Exames
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
