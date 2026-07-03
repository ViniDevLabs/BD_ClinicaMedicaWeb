import { LoginForm } from './LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-xl shadow-lg border border-slate-100">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Sistema Clínica Médica</h1>
          <p className="text-sm text-slate-500">
            Acesse sua conta para continuar
          </p>
        </div>
        
        <LoginForm />
        
        <div className="mt-6 text-center text-sm text-slate-600">
          Não possui conta?{' '}
          <a href="/cadastro" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
}