import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
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
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [pacienteParaExcluir, setPacienteParaExcluir] =
    useState<Paciente | null>(null);

  const carregarPacientes = async () => {
    try {
      setLoading(true);
      const response = await api.get<Paciente[]>("/pacientes");
      setPacientes(response.data);
    } catch (error) {
      toast.error("Erro ao carregar a lista de pacientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  const confirmarExclusao = async () => {
    if (!pacienteParaExcluir) return;
    try {
      await api.delete(`/pacientes/${pacienteParaExcluir.id}`);
      toast.success("Paciente excluído com sucesso.");
      setPacientes((prev) =>
        prev.filter((p) => p.id !== pacienteParaExcluir.id),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao excluir o paciente.");
    } finally {
      setPacienteParaExcluir(null);
    }
  };

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/admin" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Gerenciar Pacientes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Pacientes
          </h2>
          <p className="text-slate-500">
            Listagem e controle de pacientes cadastrados.
          </p>
        </div>
        <Button
          className="gap-2 shrink-0"
          onClick={() => navigate("/admin/pacientes/novo")}
        >
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
                      onClick={() =>
                        navigate(`/admin/pacientes/${paciente.id}/editar`)
                      }
                      className="text-slate-500 hover:text-blue-600"
                    >
                      <Pencil size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPacienteParaExcluir(paciente)}
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

      <AlertDialog
        open={!!pacienteParaExcluir}
        onOpenChange={(open) => !open && setPacienteParaExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o paciente{" "}
              <strong>{pacienteParaExcluir?.nome}</strong>? Se não existirem
              outros perfis atrelados a este usuário, o acesso ao sistema também
              será revogado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarExclusao}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
