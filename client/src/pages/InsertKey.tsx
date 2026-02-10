import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { ChevronLeft, AlertCircle } from 'lucide-react';

/**
 * Design: Tela simples de inserção de chave
 * - Campo de texto para chave
 * - Botão "Validar chave"
 * - Mensagens de erro/sucesso
 */
export default function InsertKey() {
  const { user, isAuthenticated, setCurrentValidation } = useAuth();
  const [, navigate] = useLocation();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'testador') {
      navigate('/home');
    }
  }, [isAuthenticated, user, navigate]);

  const handleValidateKey = async () => {
    setError('');
    setLoading(true);

    try {
      if (!key.trim()) {
        setError('Por favor, insira uma chave');
        return;
      }

      // Simular validação de chave
      // Chaves válidas começam com "KEY_"
      if (!key.startsWith('KEY_')) {
        setError('Chave inválida. Formato esperado: KEY_XXXXX');
        return;
      }

      // Criar sessão de validação
      const validation = {
        id: 'val_' + Math.random().toString(36).substr(2, 9),
        status: 'in_progress' as const,
        key,
        division: 'Passageiros',
        system: 'Encomendas',
        environment: 'QA',
        startTime: new Date(),
      };

      setCurrentValidation(validation);
      navigate('/validation-execution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-[#013171] hover:underline mb-8 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Card de Inserção de Chave */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Iniciar Validação
          </h1>
          <p className="text-gray-600 mb-6">
            Insira a chave fornecida pelo auditor para começar
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 text-sm text-red-700 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chave de Acesso
              </label>
              <Input
                type="text"
                placeholder="KEY_XXXXX"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={loading}
                className="w-full font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Dica: use "KEY_TEST1" para testar
              </p>
            </div>

            <Button
              onClick={handleValidateKey}
              disabled={loading || !key}
              className="w-full bg-[#013171] hover:bg-[#0a1f4a] text-white font-medium py-2"
            >
              {loading ? 'Validando...' : 'Validar Chave'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
