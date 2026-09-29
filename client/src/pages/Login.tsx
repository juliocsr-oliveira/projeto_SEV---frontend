import { useAuth } from '@/contexts/AuthContext';
import { FormEvent, useState } from 'react';
import { AlertCircle, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const success = await login(email, password);

      if (!success) {
        setError('Credenciais inválidas.');
      }

    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        'Erro ao fazer login. Verifique suas credenciais.';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-10 border border-gray-200">

        {/* Logo Institucional */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#013171] rounded-lg flex items-center justify-center mx-auto mb-6 shadow-md">
            <LogIn className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-[#013171] mb-2">
            SEV
          </h1>

          <p className="text-gray-600 text-sm">
            Sistema de Evidência de Validação
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">

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

            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#013171] hover:bg-[#024a9f] text-white py-3 rounded-md transition-all transform hover:scale-[1.02] font-medium shadow-md"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

        </form>

        {/* Rodapé */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>SEV © {new Date().getFullYear()}</p>
        </div>

      </div>
    </div>
  );
}