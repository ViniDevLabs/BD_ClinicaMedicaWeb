import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { medicoService } from "@/services/medico/medicoService";
import { validarCPF } from "@/lib/validations";
import { mascaraCPFInput } from "@/lib/formatters";

const medicoSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  cpf: z
    .string()
    .min(14, "O CPF deve estar completo")
    .refine((val) => validarCPF(val), "CPF inválido")
    .transform((val) => val.replace(/\D/g, "")),
  email: z.email("E-mail inválido"),

  senha: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 8,
      "A senha deve conter no mínimo 8 dígitos",
    ),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato AAAA-MM-DD"),
  numero: z.number({ message: "Obrigatório" }).min(1, "Obrigatório"),
  estado: z.string().length(2, "Sigla (ex: SP)"),
  especialidadesInput: z.string().min(3, "Obrigatório (separadas por vírgula)"),
});

type MedicoForm = z.infer<typeof medicoSchema>;

export function FormularioMedico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loadingDados, setLoadingDados] = useState(isEditing);

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicoForm>({
    resolver: zodResolver(medicoSchema),
  });

  const { onChange: cpfOnChange, ...cpfRegisterRest } = register("cpf");

  useEffect(() => {
    if (isEditing) {
      medicoService
        .buscarPorId(Number(id))
        .then((dados) => {
          reset({
            nome: dados.nome,
            cpf: mascaraCPFInput(dados.cpf),
            email: dados.email,
            dataNascimento: dados.dataNascimento,
            numero: dados.numero,
            estado: dados.estado,
            especialidadesInput: dados.especialidades.join(", "),
          });
        })
        .catch(() => {
          toast.error("Erro ao carregar dados do médico.");
          navigate("/admin/medicos");
        })
        .finally(() => setLoadingDados(false));
    }
  }, [id, isEditing, reset, navigate]);

  const onSubmit = async (data: MedicoForm) => {
    if (!isEditing && (!data.senha || data.senha.trim() === "")) {
      toast.error("A senha é obrigatória para novos cadastros.");
      return;
    }

    const payload: any = {
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      dataNascimento: data.dataNascimento,
      ehAdministrador: 0,
      numero: data.numero,
      estado: data.estado,
      especialidades: data.especialidadesInput
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e !== ""),
    };

    if (data.senha && data.senha.trim() !== "") {
      payload.senha = data.senha;
    }

    try {
      if (isEditing) {
        await medicoService.atualizar(Number(id), payload);
        toast.success("Médico atualizado com sucesso!");
      } else {
        await medicoService.criar(payload);
        toast.success("Médico cadastrado com sucesso!");
      }
      navigate("/admin/medicos");
    } catch (error: any) {
      toast.error(
        error.response?.data?.erro || "Ocorreu um erro ao salvar os dados.",
      );
    }
  };

  if (loadingDados)
    return <div className="p-8 text-slate-500">Carregando dados...</div>;

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
            <BreadcrumbLink render={<Link to="/admin/medicos" />}>
              Médicos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isEditing ? "Editar Médico" : "Novo Médico"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {isEditing ? "Editar Médico" : "Adicionar Médico"}
        </h2>
        <p className="text-slate-500">
          Preencha as informações profissionais e biográficas.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Nome Completo</Label>
                <Input
                  placeholder="Nome do profissional"
                  {...register("nome")}
                />
                {errors.nome && (
                  <span className="text-sm text-red-500">
                    {errors.nome.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  disabled={isEditing}
                  className={isEditing ? "bg-slate-100 text-slate-500" : ""}
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
                <Label>Data de Nascimento</Label>
                <Input type="date" {...register("dataNascimento")} />
                {errors.dataNascimento && (
                  <span className="text-sm text-red-500">
                    {errors.dataNascimento.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  placeholder="medico@clinica.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">
                  Senha{" "}
                  {isEditing && (
                    <span className="text-slate-400 font-normal">
                      (Deixe em branco para manter)
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
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
                <Label>Número CRM</Label>
                <Input
                  type="number"
                  placeholder="Apenas números"
                  {...register("numero", { valueAsNumber: true })}
                />
                {errors.numero && (
                  <span className="text-sm text-red-500">
                    {errors.numero.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label>Estado (UF)</Label>
                <Input
                  placeholder="SP"
                  maxLength={2}
                  {...register("estado")}
                  className="uppercase"
                />
                {errors.estado && (
                  <span className="text-sm text-red-500">
                    {errors.estado.message}
                  </span>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Especialidades</Label>
                <Input
                  placeholder="Infectologia, Pediatria, Cirurgia Geral"
                  {...register("especialidadesInput")}
                />
                <p className="text-xs text-slate-500">
                  Separe as especialidades por vírgula.
                </p>
                {errors.especialidadesInput && (
                  <span className="text-sm text-red-500">
                    {errors.especialidadesInput.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/medicos")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Médico"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
