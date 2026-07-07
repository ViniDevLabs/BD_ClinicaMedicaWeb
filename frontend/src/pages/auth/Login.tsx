import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(11, "Digite apenas os 11 números do CPF"),
  senha: z.string().min(1, "A senha é obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [erroApi, setErroApi] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setErroApi(null);
      await login(data);
      navigate("/");
    } catch (error: any) {
      setErroApi(
        error.response?.data?.erro || "Erro ao conectar com o servidor.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Clínica Médica
          </CardTitle>
          <CardDescription className="text-center">
            Insira suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF (apenas números)</Label>
              <Input id="cpf" placeholder="00000000000" {...register("cpf")} />
              {errors.cpf && (
                <span className="text-sm text-red-500">
                  {errors.cpf.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" {...register("senha")} />
              {errors.senha && (
                <span className="text-sm text-red-500">
                  {errors.senha.message}
                </span>
              )}
            </div>

            {erroApi && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {erroApi}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Autenticando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 mt-4">
          <p className="text-sm text-slate-500">
            É paciente e não possui conta?{" "}
            <Link
              to="/cadastro"
              className="text-slate-900 font-semibold hover:underline"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
