import { useState } from 'react';
import { User } from '../App';
import Header from './Header';
import { ArrowLeft, Database, Users, BookOpen, Plus, Edit2, Trash2, Save, FileText } from 'lucide-react';
import { auditLog } from '../utils/auditLog';
import AuditLogsModal from './AuditLogsModal';

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

  const isAdmin = user.role === 'administrador';

  const menuItems = [
    {
      id: 'structure' as const,
      title: 'Gerenciar Estrutura de Validação',
      description: 'Adicionar, editar ou remover itens de validação',
      icon: Database,
      show: true
    },
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

  const [validationItems, setValidationItems] = useState([
    { id: '1', text: 'Verificar autenticação de usuários', active: true },
    { id: '2', text: 'Validar fluxo de criação de registros', active: true },
    { id: '3', text: 'Testar edição de dados existentes', active: true },
    { id: '4', text: 'Confirmar exclusão de registros', active: true },
    { id: '5', text: 'Validar permissões de acesso', active: true },
  ]);

  const [mockUsers, setMockUsers] = useState([
    { id: '1', name: 'João Silva', email: 'joao@empresa.com', role: 'usuario', department: 'Passageiros' },
    { id: '2', name: 'Maria Santos', email: 'maria@empresa.com', role: 'auditor', department: 'Qualidade' },
    { id: '3', name: 'Admin', email: 'admin@empresa.com', role: 'administrador', department: 'TI' },
  ]);

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
      <Header user={user} />
      
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
            <p className="text-blue-200">Gerenciamento de estruturas, usuários e conteúdo</p>
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
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Estrutura de Validação</h3>
                      <p className="text-sm text-gray-600 mt-1">Versão atual: {structureVersion}</p>
                    </div>
                    <button
                      onClick={() => setShowNewItemForm(true)}
                      className="flex items-center gap-2 bg-[#013171] text-white px-4 py-2 rounded-md hover:bg-[#024a9f] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Item
                    </button>
                  </div>

                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Atenção:</strong> Alterações na estrutura criarão uma nova versão. 
                      Validações em andamento usarão a versão anterior.
                    </p>
                  </div>

                  {showNewItemForm && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold mb-3">Novo Item de Validação</h4>
                      <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Digite o texto do item de validação"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddItem}
                          className="bg-[#013171] text-white px-4 py-2 rounded-md hover:bg-[#024a9f] transition-colors"
                        >
                          Adicionar
                        </button>
                        <button
                          onClick={() => {
                            setShowNewItemForm(false);
                            setNewItemText('');
                          }}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-6">
                    {validationItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-gray-500 font-mono text-sm">{index + 1}</span>
                          <p className="text-gray-800">{item.text}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-[#013171] hover:bg-blue-100 rounded transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Versão
                      </label>
                      <input
                        type="text"
                        value={structureVersion}
                        onChange={(e) => setStructureVersion(e.target.value)}
                        placeholder="Ex: 2.2.0"
                        className="w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
                      />
                    </div>
                    <button
                      onClick={handleSaveStructure}
                      className="mt-6 flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      Salvar Estrutura
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'users' && isAdmin && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Gerenciar Usuários</h3>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowLogsModal(true)}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Extrair Logs
                      </button>
                      <button className="flex items-center gap-2 bg-[#013171] text-white px-4 py-2 rounded-md hover:bg-[#024a9f] transition-colors">
                        <Plus className="w-4 h-4" />
                        Adicionar Usuário
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Perfil</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Setor</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockUsers.map((user, index) => (
                          <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm">{user.name}</td>
                            <td className="px-4 py-3 text-sm">{user.email}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{user.department}</td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex gap-2">
                                <button className="p-1 text-[#013171] hover:bg-blue-100 rounded">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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