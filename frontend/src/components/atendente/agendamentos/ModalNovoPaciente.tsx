import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { pacienteService } from "@/services/paciente/pacienteService";
import { validarCPF } from "@/lib/validations";
import { mascaraCPFInput } from "@/lib/formatters";
import type { CadastroPacienteRequest } from "@/types/paciente";

const pacienteSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  cpf: z
    .string()
    .min(14, "O CPF deve estar completo")
    .refine((val) => validarCPF(val), "CPF inválido")
    .transform((val) => val.replace(/\D/g, "")),
  email: z.email("E-mail inválido"),
  senha: z.string().min(8, "A senha deve conter no mínimo 8 caracteres"),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato AAAA-MM-DD"),
  convenio: z.string().optional(),
  numCarteirinha: z.string().optional(),
});

type PacienteForm = z.infer<typeof pacienteSchema>;

interface ModalNovoPacienteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSucesso: () => void;
}

export function ModalNovoPaciente({
  open,
  onOpenChange,
  onSucesso,
}: ModalNovoPacienteProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PacienteForm>({
    resolver: zodResolver(pacienteSchema),
  });

  const { onChange: cpfOnChange, ...cpfRegisterRest } = register("cpf");

  const onSubmit = async (data: PacienteForm) => {
    try {
      const payload: CadastroPacienteRequest = {
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        senha: data.senha,
        dataNascimento: data.dataNascimento,
        ehAdministrador: 0,
        convenio: data.convenio || "",
        numCarteirinha: data.numCarteirinha || "",
      };

      await pacienteService.cadastrar(payload);
      toast.success("Paciente cadastrado com sucesso!");
      onSucesso();
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.erro || "Erro ao cadastrar paciente.");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
    setMostrarSenha(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo paciente. Todos os campos marcados com *
            são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Nome Completo *</Label>
              <Input
                placeholder="Nome completo do paciente"
                {...register("nome")}
              />
              {errors.nome && (
                <span className="text-sm text-red-500">
                  {errors.nome.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                maxLength={14}
                {...cpfRegisterRest}
                onChange={(e) => {
                  e.target.value = mascaraCPFInput(e.target.value);
                  cpfOnChange(e);
                }}
              />
              {errors.cpf && (
                <span className="text-sm text-red-500">
                  {errors.cpf.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Data de Nascimento *</Label>
              <Input type="date" {...register("dataNascimento")} />
              {errors.dataNascimento && (
                <span className="text-sm text-red-500">
                  {errors.dataNascimento.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>E-mail *</Label>
              <Input
                type="email"
                placeholder="paciente@email.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha *</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  {...register("senha")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Exibir senha"}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.senha && (
                <span className="text-sm text-red-500">
                  {errors.senha.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Convênio</Label>
              <Input
                placeholder="Ex: Unimed, Amil..."
                {...register("convenio")}
              />
            </div>

            <div className="space-y-2">
              <Label>Número da Carteirinha</Label>
              <Input
                placeholder="Número da carteirinha"
                {...register("numCarteirinha")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar Paciente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
