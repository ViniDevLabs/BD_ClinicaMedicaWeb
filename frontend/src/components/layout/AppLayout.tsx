import { Outlet, useLocation } from "react-router-dom";
import { AppHeader } from "../navigation/AppHeader";
import { AppSidebar } from "../navigation/AppSidebar";
import { Toaster } from "sonner";

export function AppLayout() {
  const location = useLocation();
  const estaNaTelaDeSelecao = location.pathname === "/selecionar-perfil";

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        {!estaNaTelaDeSelecao && <AppSidebar />}

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
