import { useState } from 'react';
import { User } from '../App';
import { ValidationDraft } from './CreateValidation';
import { SelectedSystem } from './SystemSelection';
import Header from './Header';
import { ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from './ui/breadcrumb';

interface EditValidationFieldsProps {
  validationDraft: ValidationDraft;
  selectedSystems: SelectedSystem[];
  onNext: (fields: ValidationField[]) => void;
  onBack: () => void;
  user: User;
}

export interface ValidationField {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'checkbox' | 'select' | 'file';
  required: boolean;
  order: number;
}

// Campos padrão iniciais
const defaultFields: ValidationField[] = [
  {
    id: '1',
    name: 'Verificar login no sistema',
    description: 'Validar se o login está funcionando corretamente',
    type: 'checkbox',
    required: true,
    order: 1
  },
  {
    id: '2',
    name: 'Testar criação de novo registro',
    description: 'Criar um novo registro e validar se foi salvo',
    type: 'checkbox',
    required: true,
    order: 2
  },
  {
    id: '3',
    name: 'Validar edição de dados',
    description: 'Editar um registro existente e confirmar as mudanças',
    type: 'checkbox',
    required: true,
    order: 3
  },
  {
    id: '4',
    name: 'Confirmar exclusão de registros',
    description: 'Deletar um registro e verificar se foi removido',
    type: 'checkbox',
    required: true,
    order: 4
  }
];

export default function EditValidationFields({ 
  validationDraft, 
  selectedSystems,
  onNext, 
  onBack, 
  user 
}: EditValidationFieldsProps) {
  const [fields, setFields] = useState<ValidationField[]>(defaultFields);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldDescription, setNewFieldDescription] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'checkbox' | 'select' | 'file'>('checkbox');
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [error, setError] = useState('');

  const handleAddField = () => {
    if (!newFieldName.trim()) {
      setError('Nome do campo é obrigatório');
      return;
    }

    const newField: ValidationField = {
      id: Date.now().toString(),
      name: newFieldName,
      description: newFieldDescription,
      type: newFieldType,
      required: newFieldRequired,
      order: fields.length + 1
    };

    setFields([...fields, newField]);
    setNewFieldName('');
    setNewFieldDescription('');
    setNewFieldType('checkbox');
    setNewFieldRequired(true);
    setError('');
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleUpdateField = (id: string, updates: Partial<ValidationField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newFields = [...fields];
    [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
    setFields(newFields);
  };

  const handleMoveDown = (index: number) => {
    if (index === fields.length - 1) return;
    const newFields = [...fields];
    [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    setFields(newFields);
  };

  const handleSubmit = () => {
    if (fields.length === 0) {
      setError('Adicione pelo menos um campo de validação');
      return;
    }

    onNext(fields);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={onBack}
                    className="text-gray-500 hover:text-[#013171] cursor-pointer"
                  >
                    1. Criar Validação
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={onBack}
                    className="text-gray-500 hover:text-[#013171] cursor-pointer"
                  >
                    2. Selecionar Sistema
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#013171] font-medium">
                    3. Editar Campos de Validação
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Cabeçalho */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#013171] hover:text-[#024a9f] mb-4 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Editar Campos de Validação
            </h1>
            <p className="text-gray-600">
              Configure os campos que serão validados para <strong>{validationDraft.name}</strong>
            </p>
          </div>

          {/* Informações da Validação */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-[#013171]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nome da Validação</p>
                <p className="font-medium text-gray-900">{validationDraft.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo</p>
                <p className="font-medium text-gray-900">{validationDraft.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sistemas Selecionados</p>
                <p className="font-medium text-gray-900">{selectedSystems.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Campos</p>
                <p className="font-medium text-gray-900">{fields.length}</p>
              </div>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Lista de Campos Existentes */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Campos Atuais</h2>
            
            {fields.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum campo adicionado ainda</p>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#013171] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#013171] text-white text-xs font-semibold">
                            {index + 1}
                          </span>
                          <h3 className="font-medium text-gray-900">{field.name}</h3>
                          {field.required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Obrigatório</span>
                          )}
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {field.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{field.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-500 hover:text-[#013171] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Mover para cima"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === fields.length - 1}
                          className="p-2 text-gray-500 hover:text-[#013171] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Mover para baixo"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoveField(field.id)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          title="Remover campo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Adicionar Novo Campo */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Campo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Campo *
                </label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="Ex: Verificar permissões de acesso"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#013171] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newFieldDescription}
                  onChange={(e) => setNewFieldDescription(e.target.value)}
                  placeholder="Descreva o que deve ser validado"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#013171] focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Campo
                  </label>
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#013171] focus:border-transparent"
                  >
                    <option value="checkbox">Checkbox (OK/Falhou/N.A.)</option>
                    <option value="text">Texto</option>
                    <option value="select">Seleção</option>
                    <option value="file">Arquivo</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newFieldRequired}
                      onChange={(e) => setNewFieldRequired(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#013171] focus:ring-[#013171]"
                    />
                    <span className="text-sm font-medium text-gray-700">Campo Obrigatório</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleAddField}
                className="w-full bg-[#013171] text-white px-4 py-2 rounded-lg hover:bg-[#024a9f] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Campo
              </button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Voltar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-[#013171] text-white rounded-lg hover:bg-[#024a9f] transition-colors font-medium"
            >
              Continuar para Validação Criada
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
