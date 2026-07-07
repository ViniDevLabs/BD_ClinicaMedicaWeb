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
import { pacienteService } from "@/services/paciente/pacienteService";

const cadastroSchema = z.object({
  cpf: z.string().length(11, "O CPF deve ter exatamente 11 números"),
  nome: z.string().min(3, "Nome muito curto"),
  email: z.email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema),
  });

  const onSubmit = async (data: CadastroForm) => {
    try {
      setErroApi(null);
      await pacienteService.cadastrar({ ...data, ehAdministrador: 0 });
      navigate("/login", {
        state: { mensagem: "Cadastro realizado com sucesso. Faça login." },
      });
    } catch (error: any) {
      setErroApi(error.response?.data?.erro || "Erro ao realizar cadastro.");
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
                <Label>CPF (Apenas números)</Label>
                <Input placeholder="00000000000" {...register("cpf")} />
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
                  placeholder="seu@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label>Senha</Label>
                <Input type="password" {...register("senha")} />
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
