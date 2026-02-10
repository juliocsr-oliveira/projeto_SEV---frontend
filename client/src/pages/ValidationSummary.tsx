import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { ChevronLeft, Download } from 'lucide-react';

/**
 * Design: Resumo de validação com confirmação
 * - Dados da validação
 * - Campo de senha para confirmação
 * - Botão de exportação
 */
export default function ValidationSummary() {
  const { user, isAuthenticated, currentValidation } = useAuth();
  const [, navigate] = useLocation();
  const [password, setPassword] = useState('');
  const [showGmudModal, setShowGmudModal] = useState(false);
  const [gmud, setGmud] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !currentValidation) {
      navigate('/home');
    }

    // Para auditores, mostrar modal de GMUD
    if (user?.role === 'auditor') {
      setShowGmudModal(true);
    }
  }, [isAuthenticated, currentValidation, user, navigate]);

  const handleExport = () => {
    if (!password) {
      alert('Por favor, insira a senha para confirmar');
      return;
    }

    // Simular exportação
    alert('Validação exportada com sucesso em PDF e XLSX!');
    navigate('/home');
  };

  const handleGmudConfirm = () => {
    if (!gmud.trim()) {
      alert('Por favor, insira o número da GMUD');
      return;
    }
    setShowGmudModal(false);
  };

  const startTime = currentValidation?.startTime ? new Date(currentValidation.startTime) : new Date();
  const endTime = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-[#013171] hover:underline mb-8 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Card de Resumo */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Finalização da Validação
          </h1>

          {/* Informações */}
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Responsável</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Setor</p>
                <p className="font-medium text-gray-900">{user?.sector}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sistema Testado</p>
                <p className="font-medium text-gray-900">{currentValidation?.system}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ambiente</p>
                <p className="font-medium text-gray-900">{currentValidation?.environment}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data/Hora Início</p>
                <p className="font-medium text-gray-900">{startTime.toLocaleString('pt-PT')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data/Hora Fim</p>
                <p className="font-medium text-gray-900">{endTime.toLocaleString('pt-PT')}</p>
              </div>
            </div>

            {/* Divisor */}
            <div className="border-t border-gray-200" />

            {/* Campo de Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha para Confirmação
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Insira sua senha para confirmar como assinatura digital
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/home')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExport}
              className="flex-1 bg-[#013171] hover:bg-[#0a1f4a] text-white font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Finalizar e Exportar
            </Button>
          </div>
        </div>
      </main>

      {/* Modal de GMUD para Auditores */}
      <Dialog open={showGmudModal} onOpenChange={setShowGmudModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Validação Concluída</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Insira o número da GMUD para registrar esta validação.
            </p>
            <Input
              type="text"
              placeholder="Ex: GMUD-2024-001"
              value={gmud}
              onChange={(e) => setGmud(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowGmudModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGmudConfirm}
              className="bg-[#013171] hover:bg-[#0a1f4a] text-white"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
