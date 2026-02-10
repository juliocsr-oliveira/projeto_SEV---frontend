import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

/**
 * Design: Tela de seleção com dropdowns
 * - Card centralizado
 * - Três dropdowns: Divisão, Sistema, Ambiente
 * - Botão "Iniciar" desabilitado até preenchimento
 */
export default function SelectSystem() {
  const { user, isAuthenticated, setCurrentValidation } = useAuth();
  const [, navigate] = useLocation();
  const [division, setDivision] = useState('');
  const [system, setSystem] = useState('');
  const [environment, setEnvironment] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role === 'testador') {
      navigate('/home');
    }
  }, [isAuthenticated, user, navigate]);

  const handleStart = () => {
    if (division && system && environment) {
      const validation = {
        id: 'val_' + Math.random().toString(36).substr(2, 9),
        status: 'in_progress' as const,
        division,
        system,
        environment,
        startTime: new Date(),
      };
      setCurrentValidation(validation);
      navigate('/edit-structure');
    }
  };

  const isComplete = division && system && environment;

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

        {/* Card de Seleção */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Iniciar Validação
          </h1>

          <div className="space-y-4">
            {/* Divisão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Divisão
              </label>
              <Select value={division} onValueChange={setDivision}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a divisão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Passageiros">Passageiros</SelectItem>
                  <SelectItem value="Logística">Logística</SelectItem>
                  <SelectItem value="Comércio">Comércio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sistema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sistema
              </label>
              <Select value={system} onValueChange={setSystem}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o sistema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Encomendas">Encomendas</SelectItem>
                  <SelectItem value="Jornada Digital">Jornada Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ambiente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ambiente
              </label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o ambiente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QA">QA</SelectItem>
                  <SelectItem value="HMG">HMG</SelectItem>
                  <SelectItem value="PRÉ-PRODUÇÃO">PRÉ-PRODUÇÃO</SelectItem>
                  <SelectItem value="PRD">PRD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botão Iniciar */}
          <Button
            onClick={handleStart}
            disabled={!isComplete}
            className="w-full mt-8 bg-[#013171] hover:bg-[#0a1f4a] text-white font-medium py-2"
          >
            Iniciar
          </Button>
        </div>
      </main>
    </div>
  );
}
