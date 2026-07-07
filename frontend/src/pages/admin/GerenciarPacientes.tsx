import { useEffect, useState } from "react";
import { api } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { formatarCPF, formatarDataIsoParaBr } from "@/lib/formatters";

interface Paciente {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  dataNascimento: string;
  ehAdministrador: number;
  convenio?: string;
  numCarteirinha?: string;
}

export function GerenciarPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPacientes() {
      try {
        const response = await api.get<Paciente[]>("/pacientes");
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar pacientes", error);
      } finally {
        setLoading(false);
      }
    }
    carregarPacientes();
  }, []);

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const termo = busca.toLowerCase();
    const cpfLimpo = busca.replace(/\D/g, "");
    return (
      paciente.nome.toLowerCase().includes(termo) ||
      (cpfLimpo && paciente.cpf.includes(cpfLimpo))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Pacientes
          </h2>
          <p className="text-slate-500">
            Listagem e controle de pacientes cadastrados.
          </p>
        </div>
        <Button className="gap-2 shrink-0">
          <Plus size={16} /> Adicionar Paciente
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Nascimento</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Convênio</TableHead>
              <TableHead>Carteirinha</TableHead>
              <TableHead className="text-center">Admin</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-slate-500"
                >
                  Carregando...
                </TableCell>
              </TableRow>
            ) : pacientesFiltrados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-slate-500"
                >
                  Nenhum paciente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              pacientesFiltrados.map((paciente) => (
                <TableRow key={paciente.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {paciente.nome}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatarCPF(paciente.cpf)}
                  </TableCell>
                  <TableCell>
                    {formatarDataIsoParaBr(paciente.dataNascimento)}
                  </TableCell>
                  <TableCell>{paciente.email}</TableCell>
                  <TableCell>
                    {paciente.convenio || (
                      <span className="text-slate-400">Particular</span>
                    )}
                  </TableCell>
                  <TableCell>{paciente.numCarteirinha || "-"}</TableCell>
                  <TableCell className="text-center">
                    {paciente.ehAdministrador === 1 ? (
                      <Badge className="bg-slate-900 text-white hover:bg-slate-800">
                        Sim
                      </Badge>
                    ) : (
                      <span className="text-slate-400 text-sm">Não</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-blue-600"
                    >
                      <Pencil size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
