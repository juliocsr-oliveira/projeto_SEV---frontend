import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Design: Corporativo, limpo, centralizado
 * - Card centralizado com formulário de login
 * - Título do sistema em destaque
 * - Link para base de conhecimento no rodapé
 */
export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Por favor, preencha todos os campos');
        return;
      }
      
      await login(email, password);
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Card de Login */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-[#013171] rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">SEV</span>
          </div>
          <h1 className="text-3xl font-bold text-[#013171] mb-2">
            SEV
          </h1>
          <p className="text-gray-600 text-sm">
            Sistema de Evidência de Validação
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Dica: use "auditor" ou "admin" no email para testar outros perfis
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#013171] hover:bg-[#0a1f4a] text-white font-medium py-2"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </Button>
        </form>

        {/* Rodapé */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <a
            href="#"
            className="text-sm text-[#013171] hover:underline font-medium"
          >
            Base de Conhecimento
          </a>
        </div>
      </div>
    </div>
  );
}
