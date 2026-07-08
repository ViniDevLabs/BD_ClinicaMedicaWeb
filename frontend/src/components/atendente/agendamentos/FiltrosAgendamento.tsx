import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface FiltrosAgendamentoProps {
  dataFiltro: string;
  buscaPaciente: string;
  buscaMedico: string;
  onFiltroDataChange: (value: string) => void;
  onBuscaPacienteChange: (value: string) => void;
  onBuscaMedicoChange: (value: string) => void;
}

export function FiltrosAgendamento({
  dataFiltro,
  buscaPaciente,
  buscaMedico,
  onFiltroDataChange,
  onBuscaPacienteChange,
  onBuscaMedicoChange,
}: FiltrosAgendamentoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="dataFiltro">Filtrar por Data</Label>
        <Input
          id="dataFiltro"
          type="date"
          value={dataFiltro}
          onChange={(e) => onFiltroDataChange(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="buscaPaciente">Buscar Paciente</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            id="buscaPaciente"
            placeholder="Nome do paciente..."
            value={buscaPaciente}
            onChange={(e) => onBuscaPacienteChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="buscaMedico">Buscar Médico</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            id="buscaMedico"
            placeholder="Nome do médico..."
            value={buscaMedico}
            onChange={(e) => onBuscaMedicoChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );
}
