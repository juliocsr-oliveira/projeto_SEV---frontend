import { useState, useEffect } from 'react';
import { AuditLog, auditLog, formatActionName } from '../utils/auditLog';
import { X, Download, Filter, FileText, Table as TableIcon, FileSpreadsheet } from 'lucide-react';

interface AuditLogsModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AuditLogsModal({ show, onClose }: AuditLogsModalProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);

  const [filters, setFilters] = useState({
    user: '',
    department: '',
    dateStart: '',
    dateEnd: '',
    system: '',
    environment: '',
    action: ''
  });

  useEffect(() => {
    const allLogs = auditLog.getAll();
    setLogs(allLogs);
    setFilteredLogs(allLogs);
  }, []);

  useEffect(() => {
    const filtered = auditLog.filter({
      user: filters.user || undefined,
      department: filters.department || undefined,
      dateStart: filters.dateStart ? new Date(filters.dateStart) : undefined,
      dateEnd: filters.dateEnd ? new Date(filters.dateEnd) : undefined,
      system: filters.system || undefined,
      environment: filters.environment || undefined,
      action: filters.action || undefined
    });
    setFilteredLogs(filtered);
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      user: '',
      department: '',
      dateStart: '',
      dateEnd: '',
      system: '',
      environment: '',
      action: ''
    });
  };

  const handleExportCSV = () => {
    auditLog.exportToCSV(filteredLogs);
  };

  const handleExportXLSX = () => {
    auditLog.exportToXLSX(filteredLogs);
  };

  const handleExportPDF = () => {
    auditLog.exportToPDF(filteredLogs);
  };

  const actionTypes = [
    'LOGIN_REALIZADO',
    'LOGOUT_REALIZADO',
    'INICIO_VALIDACAO',
    'SELECAO_AMBIENTE',
    'UPLOAD_EVIDENCIA',
    'ALTERACAO_STATUS',
    'ADICAO_COMENTARIO',
    'FINALIZACAO_VALIDACAO',
    'EXPORTACAO_RELATORIO',
    'CRIACAO_USUARIO',
    'ALTERACAO_USUARIO',
    'DESATIVACAO_USUARIO',
    'ALTERACAO_ESTRUTURA',
    'CONSULTA_VALIDACOES'
  ];

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#013171] text-white p-6 rounded-t-lg flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Logs de Auditoria</h2>
            <p className="text-blue-200 text-sm">
              Registros completos de todas as ações do sistema
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filtros */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtros</h3>
            <span className="ml-auto text-sm text-gray-600">
              {filteredLogs.length} de {logs.length} registros
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              placeholder="Usuário"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
            />

            <input
              type="text"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              placeholder="Setor"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
            />

            <input
              type="date"
              value={filters.dateStart}
              onChange={(e) => setFilters({ ...filters, dateStart: e.target.value })}
              placeholder="Data Inicial"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
            />

            <input
              type="date"
              value={filters.dateEnd}
              onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value })}
              placeholder="Data Final"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
            />

            <select
              value={filters.system}
              onChange={(e) => setFilters({ ...filters, system: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
            >
              <option value="">Todos os Sistemas</option>
              <option value="Encomendas">Encomendas</option>
              <option value="Jornada Digital">Jornada Digital</option>
            </select>

            <select
              value={filters.environment}
              onChange={(e) => setFilters({ ...filters, environment: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
            >
              <option value="">Todos os Ambientes</option>
              <option value="QA">QA</option>
              <option value="HMG">HMG</option>
              <option value="PRÉ-PRODUÇÃO">PRÉ-PRODUÇÃO</option>
              <option value="PRD">PRD</option>
            </select>

            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none col-span-2"
            >
              <option value="">Todos os Tipos de Ação</option>
              {actionTypes.map(action => (
                <option key={action} value={action}>
                  {formatActionName(action)}
                </option>
              ))}
            </select>
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
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                  Data/Hora
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Usuário
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Setor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Ação
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Sistema
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Ambiente
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  ID Validação
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Detalhes
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Nenhum registro encontrado</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-3 border-b border-gray-200 text-xs whitespace-nowrap">
                      {log.timestamp.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-xs">
                      {log.user}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-xs">
                      {log.department}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs whitespace-nowrap">
                        {formatActionName(log.action)}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-xs">
                      {log.system || '-'}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-xs">
                      {log.environment || '-'}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-xs font-mono">
                      {log.validationId || '-'}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-xs">
                      {log.resultingStatus ? (
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.resultingStatus === 'OK' ? 'bg-green-100 text-green-800' :
                          log.resultingStatus === 'Falhou' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.resultingStatus}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-xs max-w-xs truncate">
                      {log.details || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer com botões de exportação */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>

            <button
              onClick={handleExportXLSX}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar XLSX
            </button>

            <button
              onClick={handleExportPDF}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              Exportar PDF
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>

        {/* Aviso de auditoria */}
        <div className="px-6 pb-6 pt-0">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <strong>⚠️ Aviso:</strong> Estes logs são parte do processo de auditoria. 
              Nenhum registro pode ser editado ou excluído por usuários finais. 
              Os logs podem ser anexados em GMUDs através da exportação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}