import { useAuth } from '@/hooks/useAuth';
import { ROLE_NAVIGATION } from './navigationConfig';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export function AppSidebar() {
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  const userMenuItems = usuario.perfis.flatMap(role => ROLE_NAVIGATION[role]);

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tight">Clinica Médica</h2>
        <p className="text-sm text-slate-400 mt-2">Bem-vindo, {usuario.nome.split(' ')[0]}</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {userMenuItems.map((item, index) => (
          <NavLink
            key={`${item.path}-${index}`}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}