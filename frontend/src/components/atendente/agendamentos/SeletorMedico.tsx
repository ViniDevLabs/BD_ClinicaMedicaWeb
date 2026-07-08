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
import type { MedicoResponse } from "@/types/medico";

interface SeletorMedicoProps {
  medicos: MedicoResponse[];
  selecionado: MedicoResponse | null;
  onSelect: (medico: MedicoResponse) => void;
}

export function SeletorMedico({
  medicos,
  selecionado,
  onSelect,
}: SeletorMedicoProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          {selecionado ? selecionado.nome : "Selecione um médico"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar médico..." />
          <CommandList>
            <CommandEmpty>Nenhum médico encontrado.</CommandEmpty>
            <CommandGroup>
              {medicos.map((medico) => (
                <CommandItem
                  key={medico.id}
                  value={`${medico.nome} ${medico.especialidades.join(" ")}`}
                  onSelect={() => onSelect(medico)}
                >
                  <div>
                    <div className="font-medium">{medico.nome}</div>
                    <div className="text-xs text-slate-500">
                      {medico.especialidades.join(", ")}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
