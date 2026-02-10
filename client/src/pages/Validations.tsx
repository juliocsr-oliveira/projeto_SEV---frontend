import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { ChevronLeft, Download, Share2, Eye } from 'lucide-react';

interface ValidationRecord {
  id: string;
  gmud: string;
  system: string;
  environment: string;
  user: string;
  date: string;
  status: 'Pendente' | 'Em execução' | 'Concluída' | 'Bloqueada';
  division: string;
}

/**
 * Design: Tabela com filtros e ações
 * - Filtros: Sistema, Ambiente, Utilizador, Data, Status, GMUD
 * - Botões de ação: Abrir, Download, Compartilhar
 */
export default function Validations() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [validations, setValidations] = useState<ValidationRecord[]>([
    {
      id: '1',
      gmud: 'GMUD-2024-001',
      system: 'Encomendas',
      environment: 'QA',
      user: 'João Silva',
      date: '2024-01-20',
      status: 'Concluída',
      division: 'Passageiros',
    },
    {
      id: '2',
      gmud: 'GMUD-2024-002',
      system: 'Jornada Digital',
      environment: 'HMG',
      user: 'Maria Santos',
      date: '2024-01-19',
      status: 'Concluída',
      division: 'Logística',
    },
    {
      id: '3',
      gmud: '',
      system: 'Encomendas',
      environment: 'PRD',
      user: 'Pedro Costa',
      date: '2024-01-18',
      status: 'Pendente',
      division: 'Comércio',
    },
  ]);

  const [filters, setFilters] = useState({
    system: 'all',
    environment: 'all',
    user: '',
    date: '',
    status: 'all',
    gmud: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const filteredValidations = validations.filter(v => {
    if (filters.system && filters.system !== 'all' && v.system !== filters.system) return false;
    if (filters.environment && filters.environment !== 'all' && v.environment !== filters.environment) return false;
    if (filters.user && !v.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
    if (filters.status && filters.status !== 'all' && v.status !== filters.status) return false;
    if (filters.gmud && !v.gmud.includes(filters.gmud)) return false;
    return true;
  });

  const handleDownload = (id: string) => {
    alert(`Download da validação ${id} iniciado (PDF e XLSX)`);
  };

  const handleShare = (id: string) => {
    const shareUrl = `${window.location.origin}/shared/${id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link de compartilhamento copiado!');
  };

  const handleOpen = (id: string) => {
    alert(`Abrindo validação ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-[#013171] hover:underline mb-8 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Validações Anteriores
        </h1>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sistema
              </label>
              <Select value={filters.system} onValueChange={(val) => setFilters({ ...filters, system: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Encomendas">Encomendas</SelectItem>
                  <SelectItem value="Jornada Digital">Jornada Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ambiente
              </label>
              <Select value={filters.environment} onValueChange={(val) => setFilters({ ...filters, environment: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="QA">QA</SelectItem>
                  <SelectItem value="HMG">HMG</SelectItem>
                  <SelectItem value="PRÉ-PRODUÇÃO">PRÉ-PRODUÇÃO</SelectItem>
                  <SelectItem value="PRD">PRD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select value={filters.status} onValueChange={(val) => setFilters({ ...filters, status: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em execução">Em execução</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Bloqueada">Bloqueada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Utilizador
              </label>
              <Input
                type="text"
                placeholder="Nome do utilizador"
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GMUD
              </label>
              <Input
                type="text"
                placeholder="Número da GMUD"
                value={filters.gmud}
                onChange={(e) => setFilters({ ...filters, gmud: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({ system: 'all', environment: 'all', user: '', date: '', status: 'all', gmud: '' })}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Tabela de Validações */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">GMUD</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Sistema</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ambiente</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Utilizador</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredValidations.map((validation, index) => (
                  <tr key={validation.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {validation.gmud || '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{validation.system}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{validation.environment}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{validation.user}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{validation.date}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        validation.status === 'Concluída' ? 'bg-green-100 text-green-800' :
                        validation.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                        validation.status === 'Em execução' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {validation.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpen(validation.id)}
                          className="text-[#013171] hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Abrir
                        </button>
                        <button
                          onClick={() => handleDownload(validation.id)}
                          className="text-[#013171] hover:underline flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={() => handleShare(validation.id)}
                          className="text-[#013171] hover:underline flex items-center gap-1"
                        >
                          <Share2 className="w-4 h-4" />
                          Compartilhar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredValidations.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhuma validação encontrada com os filtros aplicados
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
