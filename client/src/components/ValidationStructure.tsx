import { useState, useEffect } from 'react';
import { User } from '../App';
import Header from './Header';
import { ArrowLeft, Plus, Trash2, Save, Check } from 'lucide-react';
import { auditLog } from '../utils/auditLog';

interface ValidationItem {
  id: string;
  description: string;
}

interface ValidationStructureProps {
  user: User;
  onBack: () => void;
  onComplete?: (items: ValidationItem[], validationData?: any) => void;
  isCreationFlow?: boolean;
  validationData?: any;
}

export default function ValidationStructure({ 
  user, 
  onBack, 
  onComplete, 
  isCreationFlow = false,
  validationData 
}: ValidationStructureProps) {
  const [items, setItems] = useState<ValidationItem[]>([]);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Carregar estrutura salva
    const savedStructure = localStorage.getItem('sev-validation-structure');
    if (savedStructure) {
      setItems(JSON.parse(savedStructure));
    } else {
      // Estrutura padrão
      setItems([
        { id: '1', description: 'Validar acesso ao sistema' },
        { id: '2', description: 'Verificar funcionalidades principais' },
        { id: '3', description: 'Testar integração com outros sistemas' },
      ]);
    }
  }, []);

  const addItem = () => {
    if (newItemDescription.trim()) {
      const newItem: ValidationItem = {
        id: Date.now().toString(),
        description: newItemDescription.trim()
      };
      setItems([...items, newItem]);
      setNewItemDescription('');
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, description: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, description } : item
    ));
  };

  const handleSave = () => {
    // Salvar estrutura no localStorage
    localStorage.setItem('sev-validation-structure', JSON.stringify(items));
    
    // Registrar log
    auditLog.register({
      user: user.name,
      department: user.department,
      action: 'CONFIGURACAO_ALTERADA',
      details: `Estrutura de validação atualizada com ${items.length} itens`
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);

    // Se for fluxo de criação, avançar para próxima etapa
    if (isCreationFlow && onComplete) {
      onComplete(items, validationData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#013171] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isCreationFlow ? 'Definir Estrutura da Validação' : 'Gerenciar Estrutura de Validação'}
              </h2>
              <p className="text-gray-600 text-sm">
                {isCreationFlow 
                  ? 'Configure os itens que serão validados neste teste'
                  : 'Configure a estrutura padrão dos itens de validação'
                }
              </p>
            </div>

            {/* Lista de itens */}
            <div className="space-y-4 mb-6">
              {items.map((item, index) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="text-gray-500 font-semibold min-w-[30px]">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
                    placeholder="Descrição do item a ser testado"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                    title="Remover item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum item adicionado. Adicione itens usando o formulário abaixo.
                </div>
              )}
            </div>

            {/* Adicionar novo item */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Adicionar Novo Item
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  placeholder="Digite a descrição do item"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
                />
                <button
                  onClick={addItem}
                  disabled={!newItemDescription.trim()}
                  className="bg-[#013171] text-white px-6 py-2 rounded-md hover:bg-[#024a9f] transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar
                </button>
              </div>
            </div>

            {/* Informações */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Importante:</strong> {isCreationFlow 
                  ? 'Defina todos os itens que o testador precisará validar. Você pode adicionar, remover ou editar os itens.'
                  : 'Esta estrutura será usada como modelo para novas validações. Você pode personalizá-la a qualquer momento.'
                }
              </p>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={items.length === 0}
                className="flex-1 bg-[#013171] text-white py-3 rounded-md hover:bg-[#024a9f] transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    {isCreationFlow ? 'Avançar' : 'Salvo!'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isCreationFlow ? 'Continuar' : 'Salvar Estrutura'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
