import { useState } from 'react';
import { User } from '../App';
import { ValidationDraft } from './CreateValidation';
import Header from '../components/Header';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { ArrowLeft, Check, AlertCircle, Server } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '../components/ui/breadcrumb';

interface SystemSelectionProps {
  validationDraft: ValidationDraft;
  onNext: (systems: SelectedSystem[]) => void;
  onBack: () => void;
  user: User;
}

export interface SelectedSystem {
  system: string;
  environment: string;
}

const availableSystems = [
  { id: 'encomendas', name: 'Encomendas', description: 'Sistema de gestão de encomendas' },
  { id: 'jornada-digital', name: 'Jornada Digital', description: 'Plataforma de experiência do cliente' },
  { id: 'sev', name: 'SEV', description: 'Sistema de Execução de Validações' }
];

const availableEnvironments = ['QA', 'HMG', 'PRÉ-PRODUÇÃO', 'PRD'];

export default function SystemSelection({ validationDraft, onNext, onBack, user }: SystemSelectionProps) {
  const { User, isAuthenticated, logout } = useAuth();
  const [selectedSystems, setSelectedSystems] = useState<SelectedSystem | null>(null);
  const [currentSystem, setCurrentSystem] = useState('');
  const [currentEnvironment, setCurrentEnvironment] = useState('');
  const [error, setError] = useState('');

  const handleAddSystem = () => {
    if (!currentSystem || !currentEnvironment) {
      setError('Selecione um sistema e um ambiente');
      return;
    }

    setSelectedSystems({ system: currentSystem, environment: currentEnvironment });
    setError('');
  };

  const handleSubmit = async () => {
  if (!selectedSystems) {
    setError('Selecione um sistema para continuar');
    return;
  }

  try {
    await api.patch(`/test-plans/${validationDraft.id}/`, {
      system: selectedSystems.system,
      environment: selectedSystems.environment,
    });

    onNext([selectedSystems]);

  } catch (error) {
    console.error("Erro ao atualizar TestPlan:", error);
    setError("Erro ao salvar sistema. Tente novamente.");
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={() => {logout(); onNavigate('login');}}/>

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
                  <BreadcrumbPage className="text-[#013171] font-medium">
                    2. Selecionar Sistema
                  </BreadcrumbPage>
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
                <Server className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Selecione o Sistema</h2>
                <p className="text-gray-600 text-sm">
                  Adicione o sistema e ambiente a ser validado
                </p>
              </div>
            </div>

            {/* Informações da Validação */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Validação: {validationDraft.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Tipo:</span> {validationDraft.type}
                </div>
                <div>
                  <span className="font-medium">Divisão:</span> {validationDraft.division}
                </div>
                <div>
                  <span className="font-medium">Criado por:</span> {validationDraft.createdBy}
                </div>
                <div>
                </div>
              </div>
            </div>

            {/* Formulário de Seleção */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="system" className="block text-sm font-medium text-gray-700 mb-2">
                    Sistema
                  </label>
                  <select
                    value={currentSystem}
                    onChange={(e) => {
                      setCurrentSystem(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
                  >
                    <option value="">Selecione um sistema</option>
                    {availableSystems.map(sys => (
                      <option key={sys.id} value={sys.name}>{sys.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-2">
                    Ambiente
                  </label>
                  <select
                    value={currentEnvironment}
                    onChange={(e) => {
                      setCurrentEnvironment(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
                  >
                    <option value="">Selecione um ambiente</option>
                    {availableEnvironments.map(env => (
                      <option key={env} value={env}>{env}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddSystem}
                type="button"
                className="w-full bg-[#013171] text-white py-2 rounded-md hover:bg-[#024a9f] transition-colors font-medium"
              >
                Adicionar Sistema
              </button>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            {/* Lista de Sistemas Selecionados */}
                {selectedSystems && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3">Sistema Selecionado</h3>

                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-800">
                          {selectedSystems.system}
                        </span>
                        <span className="text-gray-500">-</span>
                        <span className="text-gray-600">
                          {selectedSystems.environment}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedSystems(null)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                )}

            {/* Informação */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Selecione o sistema e ambiente para esta validação.
              </p>
            </div>

            {/* Botões de Navegação */}
            <div className="flex gap-4">
              <button
                onClick={onBack}
                type="button"
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                type="button"
                disabled={!selectedSystems}
                className={`flex-1 py-3 rounded-md transition-colors font-medium ${
                  !selectedSystems
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#013171] text-white hover:bg-[#024a9f]'
                }`}
              >
                Concluir Criação
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};