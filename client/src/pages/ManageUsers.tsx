import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Edit2, BarChart3 } from 'lucide-react';
import api from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'testador' | 'auditor' | 'admin';
  sector: string;
  status: 'Ativo' | 'Inativo';
}

interface ManageUsersProps {
  user: any;
}

export default function ManageUsers({ user }: ManageUsersProps) {
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
  });

  // ✅ FUNÇÃO CENTRAL (REUTILIZÁVEL)
  const reloadUsers = async () => {
    try {
      const res = await api.get('/users/');

      const mapped = res.data.results.map((u: any) => ({
        id: u.id,
        name: `${u.first_name} ${u.last_name}`.trim() || u.username,
        email: u.email,
        role: u.role?.toLowerCase(),
        sector: '-',
        status: u.active ? 'Ativo' : 'Inativo'
      }));

      setUsers(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ CARREGA AO INICIAR
  useEffect(() => {
    reloadUsers();
  }, []);

  // 🔒 PROTEÇÃO
  if (user.role !== 'ADMIN') {
    return <div className="p-6 text-red-600">Acesso negado</div>;
  }

  // ✅ CRIAR USUÁRIO
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert('Preencha os campos');
      return;
    }

    const [firstName, ...rest] = newUser.name.split(' ');
    const lastName = rest.join(' ');

    try {
      await api.post('/users/', {
        email: newUser.email,
        first_name: firstName,
        last_name: lastName,
      });

      await reloadUsers(); // 🔥 AGORA FUNCIONA

      setShowNewUserForm(false);
      setNewUser({ name: '', email: '' });

    } catch (err: any) {
      console.error(err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  // ✅ ALTERAR STATUS
  const handleChangeRole = async (id: string, newRole: string) => {
  try {
    await api.patch(`/users/${id}/`, {
      role_write: newRole.toUpperCase()
    });

    await reloadUsers();
  } catch (err) {
    console.error(err);
  }
};

const handleChangeStatus = async (id: string, newStatus: string) => {
  try {
    await api.patch(`/users/${id}/`, {
      active_write: newStatus === 'Ativo'
    });

    await reloadUsers();
  } catch (err) {
    console.error(err);
  }
};

  const handleExtractLogs = (userId: string) => {
    window.open(`/api/logs?user=${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8">

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800">
              Gerenciar Usuários
            </h1>

            <Button
              onClick={() => setShowNewUserForm(!showNewUserForm)}
              className="bg-[#013171] hover:bg-[#024a9f] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>

          {/* FORM */}
          {showNewUserForm && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Nome"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div className="mt-4 flex gap-2">
                <Button onClick={handleAddUser}
                className="bg-[#013171] hover:bg-[#024a9f] text-white">
                  Criar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewUserForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* TABELA */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Função</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u, index) => (
                  <tr key={u.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm">{u.name}</td>
                    <td className="px-4 py-3 text-sm">{u.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <Select 
                        value={u.role}
                        onValueChange={(value) => handleChangeRole(u.id, value)}
                      >
                        <SelectTrigger className='w-[140px]'>
                            <SelectValue />
                        </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="testador">Testador</SelectItem>
                            <SelectItem value="auditor">Auditor</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                      </Select>      
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Select
                        value={u.status}
                        onValueChange={(value) => handleChangeStatus(u.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-[#013171] hover:bg-blue-100 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleExtractLogs(u.id)}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                        >
                          <BarChart3 className="w-4 h-4" />
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