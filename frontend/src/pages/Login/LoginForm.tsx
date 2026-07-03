import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

const loginSchema = z.object({
  cpf: z.string().min(11, 'CPF inválido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setApiError(null);
      
      await login(data);
      
      navigate('/'); 
      
    } catch (error) {
      if (isAxiosError(error)) {
        const mensagemBackend = error.response?.data?.message;
        setApiError(mensagemBackend || 'Credenciais inválidas ou sem permissão de acesso.');
      } else {
        setApiError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
          {apiError}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">CPF</label>
        <input 
          {...register('cpf')} 
          className="w-full p-2 border rounded-md" 
          placeholder="000.000.000-00"
          disabled={isSubmitting}
        />
        {errors.cpf && <span className="text-xs text-red-500">{errors.cpf.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Senha</label>
        <input 
          type="password"
          {...register('senha')} 
          className="w-full p-2 border rounded-md" 
          disabled={isSubmitting}
        />
        {errors.senha && <span className="text-xs text-red-500">{errors.senha.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-slate-900 text-white p-2 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isSubmitting ? (
           // Placeholder de loading. O Lucide React possui ícones como <Loader2 className="animate-spin" />
          <span>Autenticando...</span> 
        ) : (
          <span>Entrar</span>
        )}
      </button>
    </form>
  );
}