import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { formatarCPF } from "@/lib/formatters";
import { medicoService } from "@/services/medico/medicoService";
import type { MedicoResponse } from "@/types/medico";

export function GerenciarMedicos() {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState<MedicoResponse[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [medicoParaExcluir, setMedicoParaExcluir] =
    useState<MedicoResponse | null>(null);

  const carregarMedicos = async () => {
    try {
      setLoading(true);
      const data = await medicoService.listar();
      setMedicos(data);
    } catch (error) {
      toast.error("Erro ao carregar a lista de médicos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMedicos();
  }, []);

  const confirmarExclusao = async () => {
    if (!medicoParaExcluir) return;
    try {
      await medicoService.excluir(medicoParaExcluir.id);
      toast.success("Médico excluído com sucesso.");
      setMedicos((prev) => prev.filter((m) => m.id !== medicoParaExcluir.id));
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao excluir o médico.");
    } finally {
      setMedicoParaExcluir(null);
    }
  };

  const medicosFiltrados = medicos.filter((medico) => {
    const termo = busca.toLowerCase();
    const cpfLimpo = busca.replace(/\D/g, "");
    return (
      medico.nome.toLowerCase().includes(termo) ||
      (cpfLimpo && medico.cpf.includes(cpfLimpo))
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
            <BreadcrumbPage>Gerenciar Médicos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Médicos
          </h2>
          <p className="text-slate-500">
            Gerencie o corpo clínico da instituição.
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/medicos/novo")}
          className="gap-2 shrink-0"
        >
          <Plus size={16} /> Adicionar Médico
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
              <TableHead>CRM / Estado</TableHead>
              <TableHead>Especialidades</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : medicosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Nenhum médico encontrado.
                </TableCell>
              </TableRow>
            ) : (
              medicosFiltrados.map((medico) => (
                <TableRow key={medico.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {medico.nome}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatarCPF(medico.cpf)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {medico.numero} - {medico.estado}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 min-w-[120px]">
                      {medico.especialidades.map((esp) => (
                        <Badge
                          key={esp}
                          variant="secondary"
                          className="text-xs"
                        >
                          {esp}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate(`/admin/medicos/${medico.id}/editar`)
                      }
                      className="text-slate-500 hover:text-blue-600"
                    >
                      <Pencil size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMedicoParaExcluir(medico)}
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
        open={!!medicoParaExcluir}
        onOpenChange={(open) => !open && setMedicoParaExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o médico{" "}
              <strong>{medicoParaExcluir?.nome}</strong>? Se ele não possuir
              outros perfis no sistema, seus dados de acesso também serão
              deletados.
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
