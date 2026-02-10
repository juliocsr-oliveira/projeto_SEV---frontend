import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { CheckCircle2, FileText, BookOpen, Settings, Plus } from 'lucide-react';

/**
 * Design: Dashboard corporativo com cards grandes
 * - Header azul com logo
 * - Cards de ação principais centralizados
 * - Modal de validação pendente para testadores
 * - Diferentes botões por perfil
 */
export default function Home() {
  const { user, isAuthenticated, pendingValidation, setPendingValidation } = useAuth();
  const [, navigate] = useLocation();
  const [showPendingModal, setShowPendingModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Mostrar modal de validação pendente para testadores
    if (user?.role === 'testador' && pendingValidation) {
      setShowPendingModal(true);
    }
  }, [isAuthenticated, user, pendingValidation, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleStartValidation = () => {
    setShowPendingModal(false);
    navigate('/insert-key');
  };

  const handleClosePendingModal = () => {
    setShowPendingModal(false);
  };

  // Definir botões por perfil
  const getActionButtons = () => {
    const buttons = [];

    if (user.role === 'testador') {
      buttons.push({
        id: 'start',
        label: 'Iniciar Validação',
        icon: CheckCircle2,
        onClick: () => navigate('/insert-key'),
        color: 'bg-[#013171]',
      });
    } else if (user.role === 'auditor') {
      buttons.push({
        id: 'create',
        label: 'Criar Validação',
        icon: Plus,
        onClick: () => navigate('/select-system'),
        color: 'bg-[#013171]',
      });
      buttons.push({
        id: 'edit',
        label: 'Editar Validação',
        icon: FileText,
        onClick: () => navigate('/validations'),
        color: 'bg-blue-600',
      });
    } else if (user.role === 'admin') {
      buttons.push({
        id: 'create',
        label: 'Criar Validação',
        icon: Plus,
        onClick: () => navigate('/select-system'),
        color: 'bg-[#013171]',
      });
      buttons.push({
        id: 'config',
        label: 'Configurações',
        icon: Settings,
        onClick: () => navigate('/settings'),
        color: 'bg-blue-600',
      });
    }

    buttons.push({
      id: 'history',
      label: 'Validações Anteriores',
      icon: FileText,
      onClick: () => navigate('/validations'),
      color: 'bg-gray-600',
    });

    buttons.push({
      id: 'knowledge',
      label: 'Base de Conhecimento',
      icon: BookOpen,
      onClick: () => navigate('/knowledge-base'),
      color: 'bg-gray-600',
    });

    return buttons;
  };

  const buttons = getActionButtons();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {user.name}
          </h2>
          <p className="text-gray-600 mt-2">
            Setor: <span className="font-medium">{user.sector}</span>
          </p>
        </div>

        {/* Grid de Botões */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buttons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={btn.onClick}
                className={`${btn.color} hover:opacity-90 transition-opacity rounded-lg p-6 text-white text-left shadow-md hover:shadow-lg`}
              >
                <Icon className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold">{btn.label}</h3>
              </button>
            );
          })}
        </div>
      </main>

      {/* Modal de Validação Pendente */}
      <Dialog open={showPendingModal} onOpenChange={setShowPendingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Validação Disponível
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Existe uma validação pendente para o seu setor.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
              <p><strong>Divisão:</strong> {pendingValidation?.division}</p>
              <p><strong>Sistema:</strong> {pendingValidation?.system}</p>
              <p><strong>Ambiente:</strong> {pendingValidation?.environment}</p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClosePendingModal}
            >
              Fechar
            </Button>
            <Button
              onClick={handleStartValidation}
              className="bg-[#013171] hover:bg-[#0a1f4a] text-white"
            >
              Iniciar Agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
