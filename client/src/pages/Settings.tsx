import { useState } from 'react';
import ManageUsers from '@/pages/ManageUsers'
import { User } from '@/App';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

import { ArrowLeft, Database, Users, BookOpen, Plus, Edit2, Trash2, Save, FileText } from 'lucide-react';
import { auditLog } from '@/utils/auditLog';
import AuditLogsModal from '@/components/AuditLogsModal';
import api from '@/services/api'

interface SettingsProps {
  onBack: () => void;
  user: User;
}

export default function Settings({ onBack, user }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'structure' | 'users' | 'knowledge'>('structure');
  const [structureVersion, setStructureVersion] = useState('2.1.0');
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [showLogsModal, setShowLogsModal] = useState(false);
  const { User, isAuthenticated, logout } = useAuth();

  const isAdmin = user.role === 'ADMIN';

  const menuItems = [
    {
      id: 'users' as const,
      title: 'Gerenciar Usuários',
      description: 'Controle de acessos e permissões',
      icon: Users,
      show: isAdmin
    },
    {
      id: 'knowledge' as const,
      title: 'Base de Conhecimento',
      description: 'Editar conteúdo da base de conhecimento',
      icon: BookOpen,
      show: true
    }
  ];

  const [validationItems, setValidationItems] = useState([]);

  const handleAddItem = () => {
    if (newItemText.trim()) {
      setValidationItems([
        ...validationItems,
        { id: Date.now().toString(), text: newItemText, active: true }
      ]);
      setNewItemText('');
      setShowNewItemForm(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setValidationItems(validationItems.filter(item => item.id !== id));
  };

  const handleSaveStructure = () => {
    // Registrar log de alteração de estrutura
    auditLog.register({
      user: user.name,
      department: user.department,
      action: 'ALTERACAO_ESTRUTURA',
      details: `Nova versão: ${structureVersion}, Total de itens: ${validationItems.length}`
    });
    
    alert(`Estrutura salva com sucesso!\nNova versão: ${structureVersion}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={() => {logout(); onNavigate('login');}}/>
      
      <main className="container mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#013171] hover:text-[#024a9f] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-[#013171] text-white p-6">
            <h2 className="text-2xl font-bold mb-2">Configurações</h2>
            <p className="text-blue-200">Gerenciamento de usuários e conteúdo</p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Menu lateral */}
            <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4">
              <nav className="space-y-2">
                {menuItems.filter(item => item.show).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-[#013171] text-white'
                          : 'hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 p-6">
              {activeTab === 'structure' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                  </div>
                  {showNewItemForm && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold mb-3">Novo Item de Validação</h4>
                      <div className="flex gap-2">
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'users' && isAdmin && (
                <ManageUsers user={user} />                
              )}

              {activeTab === 'knowledge' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Base de Conhecimento</h3>
                  <p className="text-gray-600 mb-6">
                    Edite o conteúdo das seções da base de conhecimento.
                  </p>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Funcionalidade de edição em desenvolvimento.
                      Entre em contato com o administrador do sistema para alterações no conteúdo.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Logs de Auditoria */}
        <AuditLogsModal
          show={showLogsModal}
          onClose={() => setShowLogsModal(false)}
        />
      </main>
    </div>
  );
}