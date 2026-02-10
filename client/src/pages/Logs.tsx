import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { ChevronLeft, Download } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  sector: string;
  action: string;
  system?: string;
  environment?: string;
  validationId?: string;
  status?: string;
}

/**
 * Design: Tabela de logs com filtros
 * - Filtros: Utilizador, Setor, Data, Sistema, Ambiente, Tipo de Ação
 * - Exportar em: CSV, XLSX, PDF
 */
export default function Logs() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '2024-01-20 14:30:00',
      user: 'João Silva',
      sector: 'Passageiros',
      action: 'Login realizado',
    },
    {
      id: '2',
      timestamp: '2024-01-20 14:35:00',
      user: 'João Silva',
      sector: 'Passageiros',
      action: 'Início de validação',
      system: 'Encomendas',
      environment: 'QA',
      validationId: 'val_123',
    },
    {
      id: '3',
      timestamp: '2024-01-20 14:45:00',
      user: 'João Silva',
      sector: 'Passageiros',
      action: 'Upload de evidência',
      validationId: 'val_123',
    },
    {
      id: '4',
      timestamp: '2024-01-20 15:00:00',
      user: 'João Silva',
      sector: 'Passageiros',
      action: 'Finalização da validação',
      validationId: 'val_123',
      status: 'Concluída',
    },
    {
      id: '5',
      timestamp: '2024-01-20 15:05:00',
      user: 'Maria Santos',
      sector: 'Auditoria',
      action: 'Logout realizado',
    },
  ]);

  const [filters, setFilters] = useState({
    user: '',
    sector: '',
    dateStart: '',
    dateEnd: '',
    system: '',
    environment: '',
    action: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/home');
    }
  }, [isAuthenticated, user, navigate]);

  const filteredLogs = logs.filter(log => {
    if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
    if (filters.sector && log.sector !== filters.sector) return false;
    if (filters.system && log.system !== filters.system) return false;
    if (filters.environment && log.environment !== filters.environment) return false;
    if (filters.action && !log.action.toLowerCase().includes(filters.action.toLowerCase())) return false;
    return true;
  });

  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    alert(`Exportando logs em formato ${format.toUpperCase()}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/manage-users')}
          className="flex items-center gap-2 text-[#013171] hover:underline mb-8 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Logs de Auditoria
        </h1>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                Setor
              </label>
              <Select value={filters.sector} onValueChange={(val) => setFilters({ ...filters, sector: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Passageiros">Passageiros</SelectItem>
                  <SelectItem value="Logística">Logística</SelectItem>
                  <SelectItem value="Comércio">Comércio</SelectItem>
                  <SelectItem value="Auditoria">Auditoria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sistema
              </label>
              <Select value={filters.system} onValueChange={(val) => setFilters({ ...filters, system: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
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
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="QA">QA</SelectItem>
                  <SelectItem value="HMG">HMG</SelectItem>
                  <SelectItem value="PRÉ-PRODUÇÃO">PRÉ-PRODUÇÃO</SelectItem>
                  <SelectItem value="PRD">PRD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Ação
              </label>
              <Input
                type="text"
                placeholder="Ex: Login, Upload"
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({ user: '', sector: '', dateStart: '', dateEnd: '', system: '', environment: '', action: '' })}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Botões de Exportação */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => handleExport('csv')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          <Button
            onClick={() => handleExport('xlsx')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar XLSX
          </Button>
          <Button
            onClick={() => handleExport('pdf')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>

        {/* Tabela de Logs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Data/Hora</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Utilizador</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Setor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ação</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Sistema</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ambiente</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Validação ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={log.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4 text-sm text-gray-900">{log.timestamp}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{log.user}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{log.sector}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{log.action}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{log.system || '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{log.environment || '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-mono">{log.validationId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhum log encontrado com os filtros aplicados
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
