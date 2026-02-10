import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Edit2, Trash2, BarChart3 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'testador' | 'auditor' | 'admin';
  sector: string;
  status: 'Ativo' | 'Inativo';
}

/**
 * Design: Tabela de gestão de utilizadores
 * - Listar utilizadores
 * - Criar novo utilizador
 * - Editar utilizador
 * - Desativar utilizador
 * - Extrair logs
 */
export default function ManageUsers() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'João Silva', email: 'joao@example.com', role: 'testador', sector: 'Passageiros', status: 'Ativo' },
    { id: '2', name: 'Maria Santos', email: 'maria@example.com', role: 'auditor', sector: 'Auditoria', status: 'Ativo' },
    { id: '3', name: 'Pedro Costa', email: 'pedro@example.com', role: 'testador', sector: 'Logística', status: 'Ativo' },
  ]);

  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'testador', sector: 'Passageiros' });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/home');
    }
  }, [isAuthenticated, user, navigate]);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const newUserObj: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as 'testador' | 'auditor' | 'admin',
      sector: newUser.sector,
      status: 'Ativo',
    };

    setUsers([...users, newUserObj]);
    setNewUser({ name: '', email: '', role: 'testador', sector: 'Passageiros' });
    setShowNewUserForm(false);
    alert('Utilizador criado com sucesso!');
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' } : u
    ));
  };

  const handleExtractLogs = (userId: string) => {
    alert(`Extraindo logs para o utilizador ${userId}...`);
    navigate('/logs');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 text-[#013171] hover:underline mb-8 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Título e Botão Novo Utilizador */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciar Utilizadores
          </h1>
          <Button
            onClick={() => setShowNewUserForm(!showNewUserForm)}
            className="bg-[#013171] hover:bg-[#0a1f4a] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Utilizador
          </Button>
        </div>

        {/* Formulário de Novo Utilizador */}
        {showNewUserForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Criar Novo Utilizador
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <Input
                  type="text"
                  placeholder="Nome completo"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Função
                </label>
                <Select value={newUser.role} onValueChange={(val) => setNewUser({ ...newUser, role: val as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="testador">Testador</SelectItem>
                    <SelectItem value="auditor">Auditor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Setor
                </label>
                <Select value={newUser.sector} onValueChange={(val) => setNewUser({ ...newUser, sector: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Passageiros">Passageiros</SelectItem>
                    <SelectItem value="Logística">Logística</SelectItem>
                    <SelectItem value="Comércio">Comércio</SelectItem>
                    <SelectItem value="Auditoria">Auditoria</SelectItem>
                    <SelectItem value="Administração">Administração</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowNewUserForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddUser}
                className="flex-1 bg-[#013171] hover:bg-[#0a1f4a] text-white"
              >
                Criar Utilizador
              </Button>
            </div>
          </div>
        )}

        {/* Tabela de Utilizadores */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Função</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Setor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={u.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{u.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{u.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 capitalize">{u.role}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{u.sector}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          className="text-[#013171] hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          {u.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleExtractLogs(u.id)}
                          className="text-[#013171] hover:underline flex items-center gap-1"
                        >
                          <BarChart3 className="w-4 h-4" />
                          Logs
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
