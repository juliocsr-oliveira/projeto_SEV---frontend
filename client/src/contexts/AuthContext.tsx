import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'testador' | 'auditor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sector: string;
}

export interface ValidationSession {
  id: string;
  status: 'pending' | 'in_progress' | 'completed';
  key?: string;
  division?: string;
  system?: string;
  environment?: string;
  gmud?: string;
  startTime?: Date;
  endTime?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  currentValidation: ValidationSession | null;
  setCurrentValidation: (validation: ValidationSession | null) => void;
  pendingValidation: ValidationSession | null;
  setPendingValidation: (validation: ValidationSession | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentValidation, setCurrentValidation] = useState<ValidationSession | null>(null);
  const [pendingValidation, setPendingValidation] = useState<ValidationSession | null>(null);

  // Simular carregamento de dados do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('sev_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Simular validação pendente para testadores
    const storedPending = localStorage.getItem('sev_pending_validation');
    if (storedPending) {
      setPendingValidation(JSON.parse(storedPending));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simular login com diferentes perfis baseado no email
    let role: UserRole = 'testador';
    let name = 'Utilizador';
    let sector = 'Passageiros';

    if (email.includes('auditor')) {
      role = 'auditor';
      name = 'Auditor';
      sector = 'Auditoria';
    } else if (email.includes('admin')) {
      role = 'admin';
      name = 'Administrador';
      sector = 'Administração';
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      sector,
    };

    setUser(newUser);
    localStorage.setItem('sev_user', JSON.stringify(newUser));

    // Simular validação pendente para testadores
    if (role === 'testador') {
      const pending: ValidationSession = {
        id: 'val_' + Math.random().toString(36).substr(2, 9),
        status: 'pending',
        division: 'Passageiros',
        system: 'Encomendas',
        environment: 'QA',
      };
      setPendingValidation(pending);
      localStorage.setItem('sev_pending_validation', JSON.stringify(pending));
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentValidation(null);
    localStorage.removeItem('sev_user');
    localStorage.removeItem('sev_pending_validation');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        currentValidation,
        setCurrentValidation,
        pendingValidation,
        setPendingValidation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
