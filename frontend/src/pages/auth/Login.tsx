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
import { Eye, EyeOff } from "lucide-react";
import { validarCPF } from "@/lib/validations";
import { mascaraCPFInput } from "@/lib/formatters";
import { toast } from "sonner";

const loginSchema = z.object({
  cpf: z
    .string()
    .min(14, "O CPF deve estar completo")
    .refine((val) => validarCPF(val), "CPF inválido")
    .transform((val) => val.replace(/\D/g, "")),
  senha: z.string().min(8, "A senha deve conter no mínimo 8 digitos"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { onChange: cpfOnChange, ...cpfRegisterRest } = register("cpf");

  const onSubmit = async (data: LoginForm) => {
    try {
      setErroApi(null);
      await login(data);

      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.erro || "Erro ao conectar com o servidor.";
      setErroApi(mensagemErro);

      toast.error(mensagemErro);
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

            {erroApi && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {erroApi}
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isSubmitting}
            >
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
