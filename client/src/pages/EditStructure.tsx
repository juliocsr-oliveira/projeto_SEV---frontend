import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';

interface ValidationItem {
  id: string;
  description: string;
}

/**
 * Design: Formulário para editar estrutura de validação
 * - Lista de itens de validação
 * - Botão para adicionar novos itens
 * - Botão para remover itens
 * - Gerar chave ao finalizar
 */
export default function EditStructure() {
  const { user, isAuthenticated, currentValidation, setCurrentValidation } = useAuth();
  const [, navigate] = useLocation();
  const [items, setItems] = useState<ValidationItem[]>([
    { id: '1', description: 'Verificar login no sistema' },
    { id: '2', description: 'Testar criação de novo registro' },
    { id: '3', description: 'Validar edição de dados' },
    { id: '4', description: 'Confirmar exclusão de registros' },
  ]);
  const [generatedKey, setGeneratedKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'auditor')) {
      navigate('/home');
    }
  }, [isAuthenticated, user, navigate]);

  const handleAddItem = () => {
    const newItem: ValidationItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, description: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, description } : item
    ));
  };

  const handleFinalize = () => {
    if (items.some(item => !item.description.trim())) {
      alert('Por favor, preencha todos os itens de validação');
      return;
    }

    // Gerar chave única
    const key = `KEY_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    setGeneratedKey(key);
    setShowKeyModal(true);

    // Atualizar validação com a chave
    if (currentValidation) {
      setCurrentValidation({
        ...currentValidation,
        key,
      });
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    alert('Chave copiada para a área de transferência!');
  };

  const handleCompleteCreation = () => {
    setShowKeyModal(false);
    navigate('/home');
  };

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

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {user?.role === 'auditor' ? 'Criar Estrutura de Validação' : 'Gerenciar Estrutura de Validação'}
        </h1>

        {/* Informações da Validação */}
        {currentValidation && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Divisão</p>
                <p className="font-medium">{currentValidation.division}</p>
              </div>
              <div>
                <p className="text-gray-600">Sistema</p>
                <p className="font-medium">{currentValidation.system}</p>
              </div>
              <div>
                <p className="text-gray-600">Ambiente</p>
                <p className="font-medium">{currentValidation.environment}</p>
              </div>
              <div>
                <p className="text-gray-600">Versão</p>
                <p className="font-medium">v1.0</p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Itens */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Itens de Validação
          </h2>

          <div className="space-y-3 mb-6">
            {items.map((item, index) => (
              <div key={item.id} className="flex gap-3 items-start">
                <span className="text-gray-500 font-medium mt-3 min-w-6">{index + 1}.</span>
                <div className="flex-1">
                  <Textarea
                    placeholder="Descrição do item de validação"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, e.target.value)}
                    className="text-sm h-12"
                  />
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 mt-3"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Botão Adicionar Item */}
          <Button
            onClick={handleAddItem}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Item
          </Button>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 max-w-2xl">
          <Button
            variant="outline"
            onClick={() => navigate('/home')}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleFinalize}
            className="flex-1 bg-[#013171] hover:bg-[#0a1f4a] text-white font-medium"
          >
            Finalizar e Gerar Chave
          </Button>
        </div>
      </main>

      {/* Modal de Chave Gerada */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Chave Gerada com Sucesso
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Chave de Acesso:</p>
              <p className="text-2xl font-mono font-bold text-green-700 break-all">
                {generatedKey}
              </p>
            </div>

            <p className="text-gray-700 mb-6">
              Envie esta chave ao testador para que ele possa iniciar a validação.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCopyKey}
                className="flex-1"
              >
                Copiar Chave
              </Button>
              <Button
                onClick={handleCompleteCreation}
                className="flex-1 bg-[#013171] hover:bg-[#0a1f4a] text-white"
              >
                Concluído
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
