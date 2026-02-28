import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "AUDITOR" | "TESTADOR";
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/auth/token/", { username: email, password });
      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Buscar dados do usuário
      const userResponse = await api.get("/users/me/");
      setUser(userResponse.data);
      setIsAuthenticated(true);

      return true; // 👈 importante
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Manter usuário logado ao recarregar a página
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const userResponse = await api.get("/users/me/");
          setUser(userResponse.data);
          setIsAuthenticated(true);
        } catch {
          logout();
        }
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};