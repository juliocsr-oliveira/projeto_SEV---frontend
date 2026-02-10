import { useState, useEffect } from 'react';
import { User, ValidationSession } from '../App';
import Header from './Header';
import { ArrowLeft, Search, Eye, Filter, Download, FileText, Table as TableIcon } from 'lucide-react';
import { auditLog } from '../utils/auditLog';

interface PreviousValidationsProps {
  onBack: () => void;
  user: User;
}

export default function PreviousValidations({ onBack, user }: PreviousValidationsProps) {
  const [validations, setValidations] = useState<ValidationSession[]>([]);
  const [filteredValidations, setFilteredValidations] = useState<ValidationSession[]>([]);
  const [filters, setFilters] = useState({
    system: '',
    environment: '',
    user: '',
    status: '',
    gmud: ''
  });
  const [searchDate, setSearchDate] = useState('');
  const [selectedValidation, setSelectedValidation] = useState<ValidationSession | null>(null);

  useEffect(() => {
    // Carregar validações do localStorage
    const stored = localStorage.getItem('sev-validations');
    if (stored) {
      const parsed = JSON.parse(stored);
      setValidations(parsed);
      setFilteredValidations(parsed);
    }
    
    // Registrar log de consulta
    auditLog.register({
      user: user.name,
      department: user.department,
      action: 'CONSULTA_VALIDACOES',
      details: 'Acesso à tela de validações anteriores'
    });
  }, [user]);

  useEffect(() => {
    // Aplicar filtros
    let filtered = [...validations];

    if (filters.system) {
      filtered = filtered.filter(v => v.system === filters.system);
    }
    if (filters.environment) {
      filtered = filtered.filter(v => v.environment === filters.environment);
    }
    if (filters.user) {
      filtered = filtered.filter(v => v.user.toLowerCase().includes(filters.user.toLowerCase()));
    }
    if (filters.status) {
      filtered = filtered.filter(v => v.status === filters.status);
    }
    if (filters.gmud) {
      filtered = filtered.filter(v => v.gmud?.toLowerCase().includes(filters.gmud.toLowerCase()));
    }
    if (searchDate) {
      filtered = filtered.filter(v => {
        const validationDate = new Date(v.startTime).toISOString().split('T')[0];
        return validationDate === searchDate;
      });
    }

    setFilteredValidations(filtered);
  }, [filters, searchDate, validations]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearFilters = () => {
    setFilters({
      system: '',
      environment: '',
      user: '',
      status: '',
      gmud: ''
    });
    setSearchDate('');
  };

  const handleDownloadPDF = (validation: ValidationSession) => {
    // Simular download de PDF
    auditLog.register({
      user: user.name,
      department: user.department,
      action: 'EXPORTACAO_RELATORIO',
      system: validation.system,
      environment: validation.environment,
      validationId: validation.id,
      details: 'Download de PDF'
    });
    
    alert(`Download do PDF da validação ${validation.id} iniciado!`);
  };

  const handleDownloadExcel = (validation: ValidationSession) => {
    // Simular download de Excel
    auditLog.register({
      user: user.name,
      department: user.department,
      action: 'EXPORTACAO_RELATORIO',
      system: validation.system,
      environment: validation.environment,
      validationId: validation.id,
      details: 'Download de XLSX'
    });
    
    alert(`Download do Excel da validação ${validation.id} iniciado!`);
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
            <h2 className="text-2xl font-bold mb-2">Validações Anteriores</h2>
            <p className="text-blue-200">Histórico e consulta de validações realizadas</p>
          </div>

          {/* Filtros */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Filtros</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <select
                value={filters.system}
                onChange={(e) => setFilters({ ...filters, system: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
              >
                <option value="">Sistema</option>
                <option value="Encomendas">Encomendas</option>
                <option value="Jornada Digital">Jornada Digital</option>
              </select>

              <select
                value={filters.environment}
                onChange={(e) => setFilters({ ...filters, environment: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
              >
                <option value="">Ambiente</option>
                <option value="QA">QA</option>
                <option value="HMG">HMG</option>
                <option value="PRÉ-PRODUÇÃO">PRÉ-PRODUÇÃO</option>
                <option value="PRD">PRD</option>
              </select>

              <input
                type="text"
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                placeholder="Usuário"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
              />

              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
              />

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
              >
                <option value="">Status</option>
                <option value="concluida">Concluída</option>
                <option value="em_andamento">Em andamento</option>
              </select>

              <input
                type="text"
                value={filters.gmud}
                onChange={(e) => setFilters({ ...filters, gmud: e.target.value })}
                placeholder="GMUD"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
              />
            </div>
            <div className="mt-3">
              <button
                onClick={clearFilters}
                className="text-sm text-[#013171] hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Data</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sistema</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ambiente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Usuário</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">GMUD</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredValidations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Nenhuma validação encontrada</p>
                    </td>
                  </tr>
                ) : (
                  filteredValidations.map((validation, index) => (
                    <tr key={validation.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        {formatDate(validation.startTime)}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        {validation.system}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {validation.environment}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        {validation.user}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        {validation.gmud || '-'}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          validation.status === 'concluida' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {validation.status === 'concluida' ? 'Concluída' : 'Em andamento'}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <button
                          onClick={() => setSelectedValidation(validation)}
                          className="flex items-center gap-1 text-[#013171] hover:text-[#024a9f] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">Abrir</span>
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(validation)}
                          className="flex items-center gap-1 text-[#013171] hover:text-[#024a9f] transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm">PDF</span>
                        </button>
                        <button
                          onClick={() => handleDownloadExcel(validation)}
                          className="flex items-center gap-1 text-[#013171] hover:text-[#024a9f] transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm">Excel</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de detalhes */}
      {selectedValidation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-[#013171] text-white p-6 sticky top-0">
              <h3 className="text-xl font-bold mb-2">Detalhes da Validação</h3>
              <p className="text-blue-200 text-sm">ID: {selectedValidation.id}</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Sistema:</span>
                  <p className="font-medium">{selectedValidation.system}</p>
                </div>
                <div>
                  <span className="text-gray-600">Ambiente:</span>
                  <p className="font-medium">{selectedValidation.environment}</p>
                </div>
                <div>
                  <span className="text-gray-600">Responsável:</span>
                  <p className="font-medium">{selectedValidation.user}</p>
                </div>
                <div>
                  <span className="text-gray-600">Data:</span>
                  <p className="font-medium">{formatDate(selectedValidation.startTime)}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Itens Validados</h4>
                <div className="space-y-2">
                  {selectedValidation.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded p-3">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm flex-1">{item.item}</p>
                        <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                          item.status === 'OK' ? 'bg-green-100 text-green-800' :
                          item.status === 'Falhou' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      {item.comment && (
                        <p className="text-xs text-gray-600 mt-2">Comentário: {item.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedValidation(null)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}