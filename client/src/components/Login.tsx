import { useState } from 'react';
import { User } from '../App';
import { LogIn } from 'lucide-react';
import { auditLog } from '../utils/auditLog';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - diferentes roles baseados no email
    let role: User['role'] = 'testador';
    if (email.includes('admin')) role = 'administrador';
    else if (email.includes('auditor')) role = 'auditor';
    
    const user: User = {
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      role,
      department: 'Passageiros'
    };
    
    // Registrar log de login
    auditLog.register({
      user: user.name,
      department: user.department,
      action: 'LOGIN_REALIZADO',
      details: `Login via email: ${user.email}`
    });
    
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#013171] rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#013171] mb-2">SEV</h1>
          <p className="text-gray-600">Sistema de Evidência e Validação</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
              placeholder="seu.email@empresa.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#013171] text-white py-3 rounded-md hover:bg-[#024a9f] transition-colors font-medium"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-[#013171] hover:underline text-sm">
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p className="mb-2"><strong>Dica de acesso:</strong></p>
          <p>Testador: qualquer email sem 'admin' ou 'auditor'</p>
          <p>Auditor: email contendo 'auditor'</p>
          <p>Admin: email contendo 'admin'</p>
          <p className="mt-3 text-blue-600">Chave demo: <strong>VAL-DEMO-123456</strong></p>
        </div>
      </div>
    </div>
  );
}