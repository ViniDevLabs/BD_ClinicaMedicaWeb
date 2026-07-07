import { useAuth } from "@/hooks/useAuth";
import { ROLE_NAVIGATION } from "./navigationConfig";
import { NavLink, useLocation } from "react-router-dom";

export function AppSidebar() {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) return null;

  const getActiveMenu = () => {
    if (location.pathname.startsWith("/admin"))
      return ROLE_NAVIGATION["ADMINISTRADOR"];
    if (location.pathname.startsWith("/medico"))
      return ROLE_NAVIGATION["MEDICO"];
    if (location.pathname.startsWith("/atendente"))
      return ROLE_NAVIGATION["ATENDENTE"];
    if (location.pathname.startsWith("/paciente"))
      return ROLE_NAVIGATION["PACIENTE"];
    return [];
  };

  const menuItems = getActiveMenu();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800">
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Menu Principal
        </p>

        {menuItems.map((item, index) => (
          <NavLink
            key={`${item.path}-${index}`}
            to={item.path}
            end={
              item.path === "/admin" ||
              item.path === "/medico" ||
              item.path === "/atendente" ||
              item.path === "/paciente"
            }
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
