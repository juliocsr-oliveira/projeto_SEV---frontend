import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { useEffect } from 'react';
import { CheckCircle2, FileText, BookOpen, Settings, Plus } from 'lucide-react';

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

interface HomeProps {
  onNavigate: (screen: Screen) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { user, isAuthenticated, logout } = useAuth();

  console.log("AUTH", isAuthenticated);
  console.log("USER", user);
  console.log("ROLE REAL:", user.role);

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('login');
    }
  }, [isAuthenticated, onNavigate]);

  if (!isAuthenticated || !user) {
    return <div className="p-10 text-center">Carregando...</div>;
  }

  const getActionButtons = () => {
    const buttons = [];

    // TESTADOR
    if (user.role === 'TESTADOR') {
      buttons.push({
        id: 'start',
        title: 'Iniciar Validação',
        description: 'Acessar validação com chave fornecida',
        icon: CheckCircle2,
        screen: 'enter-key' as Screen,
      });
    }

    // AUDITOR
    if (user.role === 'AUDITOR') {
      buttons.push(
        {
          id: 'create',
          title: 'Criar Validação',
          description: 'Montar plano de testes e gerar chave',
          icon: Plus,
          screen: 'create-validation' as Screen,
        },
        {
          id: 'edit',
          title: 'Editar Validação',
          description: 'Modificar validações existentes',
          icon: FileText,
          screen: 'edit-validation' as Screen,
        }
      );
    }

    // ADMIN
    if (user.role === 'ADMIN') {
      buttons.push(
        {
          id: 'create',
          title: 'Criar Validação',
          description: 'Montar plano de testes e gerar chave',
          icon: Plus,
          screen: 'create-validation' as Screen,
        },
        {
          id: 'settings',
          title: 'Configurações',
          description: 'Administrar usuários e extrair logs',
          icon: Settings,
          screen: 'settings' as Screen,
        }
      );
    }

    // Botões comuns a todos
    buttons.push(
      {
        id: 'history',
        title: 'Validações Anteriores',
        description: 'Consultar histórico e fazer download',
        icon: FileText,
        screen: 'previous-validations' as Screen,
      },
      {
        id: 'knowledge',
        title: 'Base de Conhecimento',
        description: 'Guias, instruções e boas práticas',
        icon: BookOpen,
        screen: 'knowledge-base' as Screen,
      }
    );

    return buttons;
  };

  const buttons = getActionButtons();

  return (
    <div className="min-h-screen bg-gray-50">
<Header
  user={user} onLogout={() => {logout(); onNavigate('login');}}/>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">

          {/* Título */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Bem-vindo, {user.first_name}
            </h2>
            <p className="text-gray-600 capitalize">
              Perfil: {user.role.toLowerCase()}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buttons.map((btn) => {
              const Icon = btn.icon;

              return (
                <button
                  key={btn.id}
                  onClick={() => onNavigate(btn.screen)}
                  className="bg-[#013171] hover:bg-[#024a9f] text-white p-8 rounded-lg shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Icon className="w-8 h-8" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {btn.title}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {btn.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}