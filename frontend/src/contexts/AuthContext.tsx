import {
  createContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Usuario, Role } from "@/types/usuario";
import type { LoginRequest } from "@/types/auth";
import { authService } from "@/services/auth/authService";

interface AuthContextData {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function carregarSessao() {
      const token = localStorage.getItem("@Clinica:token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const dadosUsuario = await authService.getMe();
        setUsuario(dadosUsuario);
      } catch (error) {
        console.error("Falha ao restaurar sessão anterior:", error);
        localStorage.removeItem("@Clinica:token");
      } finally {
        setIsLoading(false);
      }
    }

    carregarSessao();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);

      localStorage.setItem("@Clinica:token", response.token);

      const dadosUsuario = await authService.getMe();

      setUsuario(dadosUsuario);
    } catch (error) {
      localStorage.removeItem("@Clinica:token");
      setUsuario(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("@Clinica:token");
    setUsuario(null);
  }, []);

  const hasRole = useCallback(
    (role: Role) => {
      return usuario?.perfis.includes(role) ?? false;
    },
    [usuario],
  );

  const hasAnyRole = useCallback(
    (roles: Role[]) => {
      return usuario?.perfis.some((r) => roles.includes(r)) ?? false;
    },
    [usuario],
  );

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated: !!usuario,
        isLoading,
        login,
        logout,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
