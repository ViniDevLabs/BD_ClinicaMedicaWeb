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

interface Atendente {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  dataNascimento: string;
  ehAdministrador: number;
  matricula: string;
}

export function GerenciarAtendentes() {
  const navigate = useNavigate();
  const [atendentes, setAtendentes] = useState<Atendente[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [atendenteParaExcluir, setAtendenteParaExcluir] =
    useState<Atendente | null>(null);

  const carregarAtendentes = async () => {
    try {
      setLoading(true);
      const response = await api.get<Atendente[]>("/atendentes");
      setAtendentes(response.data);
    } catch (error) {
      toast.error("Erro ao carregar a lista de atendentes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAtendentes();
  }, []);

  const confirmarExclusao = async () => {
    if (!atendenteParaExcluir) return;
    try {
      await api.delete(`/atendentes/${atendenteParaExcluir.id}`);
      toast.success("Atendente excluído com sucesso.");
      setAtendentes((prev) =>
        prev.filter((a) => a.id !== atendenteParaExcluir.id),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao excluir o atendente.");
    } finally {
      setAtendenteParaExcluir(null);
    }
  };

  const atendentesFiltrados = atendentes.filter((atendente) => {
    const termo = busca.toLowerCase();
    const cpfLimpo = busca.replace(/\D/g, "");
    return (
      atendente.nome.toLowerCase().includes(termo) ||
      (cpfLimpo && atendente.cpf.includes(cpfLimpo))
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
            <BreadcrumbPage>Gerenciar Atendentes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Atendentes
          </h2>
          <p className="text-slate-500">
            Gestão da equipe de recepção e triagem.
          </p>
        </div>
        <Button
          className="gap-2 shrink-0"
          onClick={() => navigate("/admin/atendentes/novo")}
        >
          <Plus size={16} /> Adicionar Atendente
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
              <TableHead>Matrícula</TableHead>
              <TableHead className="text-center">Admin</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-slate-500"
                >
                  Carregando...
                </TableCell>
              </TableRow>
            ) : atendentesFiltrados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-slate-500"
                >
                  Nenhum atendente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              atendentesFiltrados.map((atendente) => (
                <TableRow key={atendente.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {atendente.nome}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatarCPF(atendente.cpf)}
                  </TableCell>
                  <TableCell>
                    {formatarDataIsoParaBr(atendente.dataNascimento)}
                  </TableCell>
                  <TableCell>{atendente.email}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {atendente.matricula}
                  </TableCell>
                  <TableCell className="text-center">
                    {atendente.ehAdministrador === 1 ? (
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
                        navigate(`/admin/atendentes/${atendente.id}/editar`)
                      }
                      className="text-slate-500 hover:text-blue-600"
                    >
                      <Pencil size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAtendenteParaExcluir(atendente)}
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
        open={!!atendenteParaExcluir}
        onOpenChange={(open) => !open && setAtendenteParaExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o atendente{" "}
              <strong>{atendenteParaExcluir?.nome}</strong>? Se não existirem
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
