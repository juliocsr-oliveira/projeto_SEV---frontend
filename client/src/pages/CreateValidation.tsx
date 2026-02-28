import { useState } from 'react';
import { User } from '@/App';
import api from '@/services/api';
import Header from '@/components/Header';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

interface CreateValidationProps {
  onNext: (validationData: ValidationDraft) => void;
  onBack: () => void;
  user: User;
}

export interface ValidationDraft {
  id: string;
  name: string;
  description: string;
  type: string;
  division: string;
  responsible: string;
  createdBy: string;
  createdAt: Date;
  status: 'RASCUNHO' | 'CRIADA' | 'CONFIGURADA' | 'EXECUTADA';
  accessKey: string;
}

export default function CreateValidation({ onNext, onBack, user }: CreateValidationProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    division: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da validação é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.type) {
      newErrors.type = 'Tipo de validação é obrigatório';
    }

    if (!formData.division) {
      newErrors.division = 'Divisão é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    const response = await api.post("/test-plans/", {
      name: formData.name,
      description: formData.description,
      division: formData.division,
      validation_type: formData.type.toUpperCase(),
      status: "RASCUNHO",
      responsible: user.id
    });

    const createdPlan = response.data;

    console.log("createdPlan:", createdPlan);

    onNext({
      id: createdPlan.id, // UUID real
      name: createdPlan.name,
      description: createdPlan.description,
      type: createdPlan.validation_type,
      division: createdPlan.division,
      responsible: user.name,
      createdBy: user.name,
      createdAt: new Date(createdPlan.created_at),
      status: "RASCUNHO",
      accessKey: createdPlan.access_key,
    });

  } catch (error: any) {
    console.error("Erro ao criar validação:", error);

    if (error.response?.data) {
      console.log("Erro backend:", error.response.data);
    }

    alert("Erro ao criar validação. Verifique os dados.");
  }
};

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
                  <BreadcrumbPage className="text-[#013171] font-medium">
                    1. Criar Validação
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-gray-400">
                    2. Selecionar Sistema
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-gray-400">
                    3. Validação Criada
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#013171] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#013171] p-3 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Criar Nova Validação</h2>
                <p className="text-gray-600 text-sm">
                  Preencha os dados básicos da validação
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome da Validação */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Validação <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Validação de Release 2.5.0"
                  className={`w-full px-4 py-2 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none`}
                />
                {errors.name && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descreva o objetivo e escopo desta validação"
                  rows={4}
                  className={`w-full px-4 py-2 border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none resize-none`}
                />
                {errors.description && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Tipo de Validação */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Validação <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className={`w-full px-4 py-2 border ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none`}
                >
                  <option value="">Selecione um tipo</option>
                  <option value="Funcional">Funcional</option>
                  <option value="Regressão">Regressão</option>
                  <option value="Integração">Integração</option>
                  <option value="Performance">Performance</option>
                  <option value="Segurança">Segurança</option>
                  <option value="UAT">UAT (Aceite do Usuário)</option>
                </select>
                {errors.type && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.type}
                  </div>
                )}
              </div>

              {/* Divisão */}
              <div>
                <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-2">
                  Divisão <span className="text-red-500">*</span>
                </label>
                <select
                  id="division"
                  value={formData.division}
                  onChange={(e) => handleChange('division', e.target.value)}
                  className={`w-full px-4 py-2 border ${
                    errors.division ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none`}
                >
                  <option value="">Selecione uma divisão</option>
                  <option value="Passageiros">Passageiros</option>
                  <option value="Logística">Logística</option>
                  <option value="Comércio">Comércio</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                </select>
                {errors.division && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.division}
                  </div>
                )}
              </div>

              {/* Informação de campos obrigatórios */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Campos obrigatórios
                </p>
                <div className="text-xs text-gray-600 mt-2 space-y-1">
                  <p className="font-medium">📋 Fluxo de criação:</p>
                  <p>1️⃣ Preencher dados da validação (esta tela)</p>
                  <p>2️⃣ Selecionar sistemas e ambientes</p>
                  <p>3️⃣ Gerar chave de acesso para o testador</p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#013171] text-white py-3 rounded-md hover:bg-[#024a9f] transition-colors font-medium"
                >
                  Avançar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}