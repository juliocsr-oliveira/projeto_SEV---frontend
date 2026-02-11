import { useState, useEffect } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import CreateValidation, { ValidationDraft } from './components/CreateValidation';
import SystemSelection, { SelectedSystem } from './components/SystemSelection';
import ValidationCreated from './components/ValidationCreated';
import EnterKey from './components/EnterKey';
import ValidationExecution from './components/ValidationExecution';
import Finalization from './components/Finalization';
import PreviousValidations from './components/PreviousValidations';
import KnowledgeBase from './components/KnowledgeBase';
import Settings from './components/Settings';
import ValidationStructure from './components/ValidationStructure';
import EditValidation from './components/EditValidation';
import EditValidationFields, { ValidationField } from './components/EditValidationFields';
import { auditLog } from './utils/auditLog';
import { seedDemoLogs } from './utils/seedLogs';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'testador' | 'auditor' | 'administrador';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

export interface ValidationItem {
  id: string;
  item: string;
  status: 'OK' | 'Não se aplica' | 'Falhou' | '';
  evidence: File | null;
  evidencePreview: string | null;
  comment: string;
}

export interface ValidationSession {
  id: string;
  user: string;
  department: string;
  division: string;
  system: string;
  environment: string;
  gmudNumber?: string;
  accessKey?: string;
  startTime: Date;
  endTime?: Date;
  items: ValidationItem[];
  status: 'em_andamento' | 'concluida' | 'aguardando_teste';
  structureVersion: string;
  auditorConfirmation?: boolean;
  testerName?: string;
  // Novos campos para rastreamento
  validationName?: string;
  validationType?: string;
  responsible?: string;
  validationStatus?: 'RASCUNHO' | 'CRIADA' | 'CONFIGURADA' | 'EXECUTADA';
}

type Screen = 
  | 'login' 
  | 'home' 
  | 'create-validation'
  | 'system-selection'
  | 'edit-validation-fields'
  | 'validation-created'
  | 'validation-structure'
  | 'enter-key'
  | 'edit-validation'
  | 'validation-execution' 
  | 'finalization'
  | 'previous-validations'
  | 'knowledge-base'
  | 'settings';

export default function App() {
  const { user, isAuthenticated, logout } = useAuth(); 
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [currentValidation, setCurrentValidation] = useState<ValidationSession | null>(null);
  const [validationDraft, setValidationDraft] = useState<ValidationDraft | null>(null);
  const [selectedSystems, setSelectedSystems] = useState<SelectedSystem[]>([]);
  const [validationFields, setValidationFields] = useState<ValidationField[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('login');
    }
  }, [isAuthenticated]);
  
  // Inicializar logs de demonstração
  useEffect(() => {
    seedDemoLogs();
  }, []);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

    const handleLogin = () => {
    setCurrentScreen('home');
  };

    const handleLogout = () => {
    logout();
    setCurrentScreen('login');
  };

  // Nova função: Iniciar processo de criação de validação
  const startValidationProcess = () => {
    setCurrentScreen('create-validation');
  };

  // Nova função: Receber dados da validação criada e avançar para seleção de sistema
  const handleValidationCreated = (draft: ValidationDraft) => {
    setValidationDraft(draft);
    
    // Registrar log de criação de validação
    auditLog.register({
      user: user!.name,
      department: user!.department,
      action: 'INICIO_VALIDACAO',
      details: `Validação criada: ${draft.name}, Tipo: ${draft.type}, Status: ${draft.status}`
    });
    
    setCurrentScreen('system-selection');
  };

  // Nova função: Receber sistemas selecionados e ir para edição de campos
  const handleSystemsSelected = (systems: SelectedSystem[]) => {
    if (!validationDraft) {
      alert('Erro: Nenhuma validação em rascunho encontrada');
      setCurrentScreen('home');
      return;
    }

    setSelectedSystems(systems);
    
    // Ir para tela de edição de campos de validação
    setCurrentScreen('edit-validation-fields');
  };

  // Nova função: Receber campos editados e finalizar criação
  const handleValidationFieldsEdited = (fields: ValidationField[]) => {
    if (!validationDraft) {
      alert('Erro: Nenhuma validação em rascunho encontrada');
      setCurrentScreen('home');
      return;
    }

    setValidationFields(fields);
    
    // Registrar log de finalização da criação
    auditLog.register({
      user: user!.name,
      department: user!.department,
      action: 'CRIACAO_VALIDACAO',
      details: `Validação configurada: ${validationDraft.name}, Sistemas: ${selectedSystems.length}, Campos: ${fields.length}, Status: AGUARDANDO_TESTE`
    });
    
    // Ir para tela de validação criada (mostra chave)
    setCurrentScreen('validation-created');
  };

  // Função legada mantida para compatibilidade (EnterKey e outras telas antigas)
  const startValidation = (division: string, system: string, environment: string, gmud?: string) => {
    const newValidation: ValidationSession = {
      id: Date.now().toString(),
      user: user!.name,
      department: user!.department,
      division,
      system,
      environment,
      gmudNumber: gmud,
      startTime: new Date(),
      items: generateValidationItems(),
      status: 'em_andamento',
      structureVersion: '2.1.0'
    };
    
    // Registrar log de início de validação
    auditLog.register({
      user: user!.name,
      department: user!.department,
      action: 'INICIO_VALIDACAO',
      system,
      environment,
      validationId: newValidation.id,
      details: `Divisão: ${division}, Estrutura: v${newValidation.structureVersion}`
    });
    
    setCurrentValidation(newValidation);
    setCurrentScreen('validation-execution');
  };

  const handleKeyValidation = (validation: ValidationSession) => {
    // Gerar itens de validação
    const validationWithItems = {
      ...validation,
      items: generateValidationItems()
    };
    setCurrentValidation(validationWithItems);
    setCurrentScreen('validation-execution');
  };

  const updateValidationItem = (itemId: string, updates: Partial<ValidationItem>) => {
    if (!currentValidation) return;
    
    setCurrentValidation({
      ...currentValidation,
      items: currentValidation.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    });
  };

  const finalizeValidation = () => {
    if (!currentValidation) return;
    
    const finalizedValidation = {
      ...currentValidation,
      endTime: new Date(),
      status: 'concluida' as const
    };
    
    // Salvar validação no histórico (localStorage)
    const history = JSON.parse(localStorage.getItem('sev-validations') || '[]');
    history.push({
      ...finalizedValidation,
      items: finalizedValidation.items.map(item => ({
        ...item,
        evidence: null, // Não salvar File no localStorage
        evidencePreview: item.evidencePreview
      }))
    });
    localStorage.setItem('sev-validations', JSON.stringify(history));
    
    setCurrentValidation(finalizedValidation);
    setCurrentScreen('finalization');
  };

  const returnToHome = () => {
    setCurrentValidation(null);
    setValidationDraft(null);
    setSelectedSystems([]);
    setValidationFields([]);
    setCurrentScreen('home');
  };

  const handleEditValidation = (validation: ValidationSession) => {
    setCurrentValidation(validation);
    // Aqui você pode redirecionar para uma tela específica de edição ou abrir modal
    // Por enquanto, vamos apenas voltar para home
    returnToHome();
  };

  return (
    <div className="min-h-screen bg-white">
      {currentScreen === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      {currentScreen === 'home' && user && (
        <Home 
          user={user} 
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === 'create-validation' && user && (
        <CreateValidation 
          onNext={handleValidationCreated}
          onBack={returnToHome}
          user={user}
        />
      )}
      {currentScreen === 'system-selection' && user && validationDraft && (
        <SystemSelection 
          validationDraft={validationDraft}
          onNext={handleSystemsSelected}
          onBack={() => {
            setValidationDraft(null);
            returnToHome();
          }}
          user={user}
        />
      )}
      {currentScreen === 'edit-validation-fields' && user && validationDraft && selectedSystems.length > 0 && (
        <EditValidationFields
          validationDraft={validationDraft}
          selectedSystems={selectedSystems}
          onNext={handleValidationFieldsEdited}
          onBack={() => {
            setSelectedSystems([]);
            setCurrentScreen('system-selection');
          }}
          user={user}
        />
      )}
      {/* Proteção: Se tentar acessar system-selection sem validationDraft */}
      {currentScreen === 'system-selection' && user && !validationDraft && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Fluxo Incompleto
            </h3>
            <p className="text-gray-600 mb-6">
              Você precisa primeiro criar uma validação antes de selecionar sistemas. Siga o fluxo correto:
              <br /><br />
              <strong>1. Criar Validação → 2. Selecionar Sistema → 3. Executar</strong>
            </p>
            <button
              onClick={returnToHome}
              className="bg-[#013171] text-white px-6 py-3 rounded-md hover:bg-[#024a9f] transition-colors font-medium"
            >
              Voltar e Criar Validação
            </button>
          </div>
        </div>
      )}
      {currentScreen === 'validation-structure' && user && (
        <ValidationStructure
          onBack={returnToHome}
          user={user}
        />
      )}
      {/* Tela de Validação Criada - Mostra chave e conclui criação */}
      {currentScreen === 'validation-created' && user && validationDraft && selectedSystems.length > 0 && (
        <ValidationCreated
          validationDraft={validationDraft}
          selectedSystems={selectedSystems}
          onComplete={returnToHome}
          onCreateAnother={() => {
            setValidationDraft(null);
            setSelectedSystems([]);
            setCurrentScreen('create-validation');
          }}
          user={user}
        />
      )}
      {currentScreen === 'enter-key' && user && (
        <EnterKey
          onBack={returnToHome}
          onValidKey={handleKeyValidation}
          user={user}
        />
      )}
      {currentScreen === 'validation-execution' && currentValidation && user && (
        <ValidationExecution
          validation={currentValidation}
          onUpdateItem={updateValidationItem}
          onFinalize={finalizeValidation}
          onBack={returnToHome}
          user={user}
        />
      )}
      {/* Proteção: Se tentar acessar validation-execution sem currentValidation, redireciona para home */}
      {currentScreen === 'validation-execution' && !currentValidation && user && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nenhuma validação ativa
            </h3>
            <p className="text-gray-600 mb-6">
              Para executar uma validação, você precisa primeiro criá-la seguindo o fluxo correto.
            </p>
            <button
              onClick={returnToHome}
              className="bg-[#013171] text-white px-6 py-3 rounded-md hover:bg-[#024a9f] transition-colors font-medium"
            >
              Voltar para o Início
            </button>
          </div>
        </div>
      )}
      {currentScreen === 'finalization' && currentValidation && user && (
        <Finalization
          validation={currentValidation}
          onComplete={returnToHome}
          user={user}
        />
      )}
      {currentScreen === 'previous-validations' && user && (
        <PreviousValidations
          onBack={returnToHome}
          user={user}
        />
      )}
      {currentScreen === 'knowledge-base' && user && (
        <KnowledgeBase
          onBack={returnToHome}
          user={user}
        />
      )}
      {currentScreen === 'settings' && user && (
        <Settings
          onBack={returnToHome}
          user={user}
        />
      )}
      {currentScreen === 'edit-validation' && user && (
        <EditValidation
          onBack={returnToHome}
          onEdit={handleEditValidation}
          user={user}
        />
      )}
    </div>
  );
}

// Gerar itens de validação padrão
function generateValidationItems(): ValidationItem[] {
  const items = [
    'Verificar autenticação de usuários',
    'Validar fluxo de criação de registros',
    'Testar edição de dados existentes',
    'Confirmar exclusão de registros',
    'Validar permissões de acesso',
    'Testar integração com APIs externas',
    'Verificar responsividade da interface',
    'Validar mensagens de erro',
    'Testar funcionalidade de busca',
    'Confirmar geração de relatórios',
    'Validar exportação de dados',
    'Testar performance com carga',
  ];

  return items.map((item, index) => ({
    id: `item-${index}`,
    item,
    status: '' as const,
    evidence: null,
    evidencePreview: null,
    comment: ''
  }));
}