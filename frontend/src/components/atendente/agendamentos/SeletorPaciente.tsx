import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserPlus } from "lucide-react";
import { formatarCPF } from "@/lib/formatters";
import type { PacienteResponse } from "@/types/paciente";

interface SeletorPacienteProps {
  pacientes: PacienteResponse[];
  selecionado: PacienteResponse | null;
  onSelect: (paciente: PacienteResponse) => void;
  onNovoPaciente: () => void;
  disabled?: boolean;
}

export function SeletorPaciente({
  pacientes,
  selecionado,
  onSelect,
  onNovoPaciente,
  disabled,
}: SeletorPacienteProps) {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={disabled}
          >
            {selecionado ? selecionado.nome : "Selecione um paciente"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar paciente..." />
            <CommandList>
              <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>
              <CommandGroup>
                {pacientes.map((paciente) => (
                  <CommandItem
                    key={paciente.id}
                    value={`${paciente.nome} ${paciente.cpf}`}
                    onSelect={() => onSelect(paciente)}
                  >
                    <div>
                      <div className="font-medium">{paciente.nome}</div>
                      <div className="text-xs text-slate-500">
                        CPF: {formatarCPF(paciente.cpf)}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        variant="link"
        size="sm"
        className="mt-2"
        onClick={onNovoPaciente}
        disabled={disabled}
      >
        <UserPlus size={14} className="mr-1" />
        Cadastrar novo paciente
      </Button>
    </div>
  );
}
