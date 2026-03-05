import { useState, useEffect } from 'react';
import { User } from '../App';
import Header from './Header';
import { PlayCircle, History, BookOpen, Settings, AlertCircle, Users, Edit } from 'lucide-react';
import { auditLog } from '../utils/auditLog';

interface HomeProps {
  user: User;
  onNavigate: (screen: 'create-validation' | 'system-selection' | 'enter-key' | 'previous-validations' | 'knowledge-base' | 'settings' | 'edit-validation') => void;
  onLogout: () => void;
}

export default function Home({ user, onNavigate, onLogout }: HomeProps) {
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [hasPendingValidation, setHasPendingValidation] = useState(false);

  useEffect(() => {
    // Verificar se há validação pendente para testadores
    if (user.role === 'testador') {
      const pendingValidations = JSON.parse(localStorage.getItem('sev-pending-validations') || '[]');
      const userPending = pendingValidations.some((v: any) => 
        v.department === user.department && v.status === 'aguardando_teste'
      );
      
      if (userPending) {
        setHasPendingValidation(true);
        setShowPendingModal(true);
      }
    }
  }, [user]);

  const isTestador = user.role === 'testador';
  const isAuditor = user.role === 'auditor';
  const isAdmin = user.role === 'administrador';
  const isAuditorOrAdmin = isAuditor || isAdmin;

  const menuItems = [
    // Testador: Iniciar Validação (com chave)
    {
      title: 'Iniciar Validação',
      description: 'Acessar validação com chave fornecida',
      icon: PlayCircle,
      color: 'bg-[#013171]',
      hoverColor: 'hover:bg-[#024a9f]',
      screen: 'enter-key' as const,
      show: isTestador
    },
    // Auditor/Admin: Criar Validação
    {
      title: 'Criar Validação',
      description: 'Montar plano de testes e gerar chave',
      icon: PlayCircle,
      color: 'bg-[#013171]',
      hoverColor: 'hover:bg-[#024a9f]',
      screen: 'create-validation' as const,
      show: isAuditorOrAdmin
    },
    // Auditor: Editar Validação
    {
      title: 'Editar Validação',
      description: 'Modificar validações existentes',
      icon: Edit,
      color: 'bg-[#013171]',
      hoverColor: 'hover:bg-[#024a9f]',
      screen: 'edit-validation' as const,
      show: isAuditor
    },
    // Todos: Validações Anteriores
    {
      title: 'Validações Anteriores',
      description: 'Consultar histórico e fazer download',
      icon: History,
      color: 'bg-[#013171]',
      hoverColor: 'hover:bg-[#024a9f]',
      screen: 'previous-validations' as const,
      show: true
    },
    // Todos: Base de Conhecimento
    {
      title: 'Base de Conhecimento',
      description: 'Guias, instruções e boas práticas',
      icon: BookOpen,
      color: 'bg-[#013171]',
      hoverColor: 'hover:bg-[#024a9f]',
      screen: 'knowledge-base' as const,
      show: true
    },
    // Admin: Configurações
    {
      title: 'Configurações',
      description: 'Administrar usuários e extrair logs',
      icon: Users,
      color: 'bg-[#013171]',
      hoverColor: 'hover:bg-[#024a9f]',
      screen: 'settings' as const,
      show: isAdmin
    },
    {
      title: 'Configurações',
      description: 'Administrar usuários e extrair logs',
      icon: Users,
      color: 'bg-[#013171]',
      hoverColor: 'hover:bg-[#024a9f]',
      screen: 'settings' as const,
      show: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Bem-vindo, {user.name}
            </h2>
            <p className="text-gray-600">
              {isTestador && 'Acesse validações pendentes com a chave fornecida'}
              {isAuditor && 'Crie validações e acompanhe o progresso'}
              {isAdmin && 'Gerencie validações, usuários e logs do sistema'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.filter(item => item.show).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => onNavigate(item.screen)}
                  className={`${item.color} ${item.hoverColor} text-white p-8 rounded-lg shadow-lg transition-all transform hover:scale-105 text-left`}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-blue-100 text-sm">{item.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal de Validação Pendente - apenas para testadores */}
      {showPendingModal && isTestador && hasPendingValidation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  Validação Disponível
                </h3>
                <p className="text-gray-600">
                  Existe uma validação pendente para o seu setor. 
                  Utilize a chave fornecida pelo auditor para iniciar.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPendingModal(false);
                  onNavigate('enter-key');
                }}
                className="flex-1 bg-[#013171] text-white py-3 rounded-md hover:bg-[#024a9f] transition-colors font-medium"
              >
                Iniciar agora
              </button>
              <button
                onClick={() => setShowPendingModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Depois
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}