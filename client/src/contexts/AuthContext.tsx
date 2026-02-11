import { createContext, useContext, useState } from 'react';
import api from '@/services/api';

interface AuthContextData {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function login(email: string, password: string) {
    // 1. Obter token
    const tokenResponse = await api.post('/auth/token/', {
      username: email,
      password,
    });

    const { access, refresh } = tokenResponse.data;

    // 2. Salvar tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    // 3. Buscar usuário autenticado
    const userResponse = await api.get('/users/me/');

    setUser(userResponse.data);
    setIsAuthenticated(true);
  }

  function logout() {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}