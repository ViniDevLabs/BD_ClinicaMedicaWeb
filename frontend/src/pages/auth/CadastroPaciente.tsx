import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { pacienteService } from "@/services/paciente/pacienteService";

// Importando as funções utilitárias que criamos
import { validarCPF } from "@/lib/validations";
import { mascaraCPFInput } from "@/lib/formatters";
import { toast } from "sonner";

const cadastroSchema = z.object({
  cpf: z
    .string()
    .min(14, "O CPF deve estar completo")
    .refine((val) => validarCPF(val), "CPF inválido")
    .transform((val) => val.replace(/\D/g, "")),
  nome: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "A senha deve conter no mínimo 8 dígitos"),
  dataNascimento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD"),
  convenio: z.string().optional(),
  numCarteirinha: z.string().optional(),
});

type CadastroForm = z.infer<typeof cadastroSchema>;

export function CadastroPaciente() {
  const navigate = useNavigate();
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema),
  });

  const { onChange: cpfOnChange, ...cpfRegisterRest } = register("cpf");

  const onSubmit = async (data: CadastroForm) => {
    try {
      setErroApi(null);
      await pacienteService.cadastrar({ ...data, ehAdministrador: 0 });

      toast.success("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.erro || "Erro ao realizar cadastro.";
      setErroApi(mensagemErro);

      toast.error(mensagemErro);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Cadastro de Paciente
          </CardTitle>
          <CardDescription>
            Crie sua conta para agendar consultas e ver exames
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Nome Completo</Label>
                <Input placeholder="Seu nome" {...register("nome")} />
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

              <div className="space-y-2 md:col-span-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="senha">Senha</Label>
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
                <Label>Convênio (Opcional)</Label>
                <Input placeholder="Ex: Unimed" {...register("convenio")} />
              </div>

              <div className="space-y-2">
                <Label>Nº Carteirinha (Opcional)</Label>
                <Input placeholder="Número" {...register("numCarteirinha")} />
              </div>
            </div>

            {erroApi && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {erroApi}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
            </Button>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-sm text-slate-500 hover:text-slate-900"
              >
                Já possui conta? Voltar ao Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
