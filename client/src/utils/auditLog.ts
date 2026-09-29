export interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  department: string;
  action: string;
  system?: string;
  environment?: string;
  validationId?: string;
  resultingStatus?: string;
  details?: string;
}

export type AuditAction = 
  | 'LOGIN_REALIZADO'
  | 'LOGOUT_REALIZADO'
  | 'INICIO_VALIDACAO'
  | 'SELECAO_AMBIENTE'
  | 'UPLOAD_EVIDENCIA'
  | 'ALTERACAO_STATUS'
  | 'ADICAO_COMENTARIO'
  | 'FINALIZACAO_VALIDACAO'
  | 'EXPORTACAO_RELATORIO'
  | 'CRIACAO_USUARIO'
  | 'ALTERACAO_USUARIO'
  | 'DESATIVACAO_USUARIO'
  | 'ALTERACAO_ESTRUTURA'
  | 'CONSULTA_VALIDACOES';

const LOG_STORAGE_KEY = 'sev-audit-logs';

export const auditLog = {
  // Registrar um novo log
  register: (params: {
    user: string;
    department: string;
    action: AuditAction;
    system?: string;
    environment?: string;
    validationId?: string;
    resultingStatus?: string;
    details?: string;
  }): void => {
    const logs = auditLog.getAll();
    
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      user: params.user,
      department: params.department,
      action: params.action,
      system: params.system,
      environment: params.environment,
      validationId: params.validationId,
      resultingStatus: params.resultingStatus,
      details: params.details
    };

    logs.push(newLog);
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  },

  // Obter todos os logs
  getAll: (): AuditLog[] => {
    const stored = localStorage.getItem(LOG_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Converter timestamps de string para Date
    return parsed.map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp)
    }));
  },

  // Filtrar logs
  filter: (filters: {
    user?: string;
    department?: string;
    dateStart?: Date;
    dateEnd?: Date;
    system?: string;
    environment?: string;
    action?: string;
  }): AuditLog[] => {
    let logs = auditLog.getAll();

    if (filters.user) {
      logs = logs.filter(log => 
        log.user.toLowerCase().includes(filters.user!.toLowerCase())
      );
    }

    if (filters.department) {
      logs = logs.filter(log => 
        log.department.toLowerCase().includes(filters.department!.toLowerCase())
      );
    }

    if (filters.dateStart) {
      logs = logs.filter(log => log.timestamp >= filters.dateStart!);
    }

    if (filters.dateEnd) {
      const endOfDay = new Date(filters.dateEnd);
      endOfDay.setHours(23, 59, 59, 999);
      logs = logs.filter(log => log.timestamp <= endOfDay);
    }

    if (filters.system) {
      logs = logs.filter(log => log.system === filters.system);
    }

    if (filters.environment) {
      logs = logs.filter(log => log.environment === filters.environment);
    }

    if (filters.action) {
      logs = logs.filter(log => log.action === filters.action);
    }

    return logs;
  },

  // Exportar para CSV
  exportToCSV: (logs: AuditLog[]): void => {
    const headers = ['Data/Hora', 'Usuário', 'Setor', 'Ação', 'Sistema', 'Ambiente', 'ID Validação', 'Status', 'Detalhes'];
    const rows = logs.map(log => [
      log.timestamp.toLocaleString('pt-BR'),
      log.user,
      log.department,
      formatActionName(log.action),
      log.system || '-',
      log.environment || '-',
      log.validationId || '-',
      log.resultingStatus || '-',
      log.details || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sev-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  },

  // Exportar para XLSX (simulado como TSV que Excel pode abrir)
  exportToXLSX: (logs: AuditLog[]): void => {
    const headers = ['Data/Hora', 'Usuário', 'Setor', 'Ação', 'Sistema', 'Ambiente', 'ID Validação', 'Status', 'Detalhes'];
    const rows = logs.map(log => [
      log.timestamp.toLocaleString('pt-BR'),
      log.user,
      log.department,
      formatActionName(log.action),
      log.system || '-',
      log.environment || '-',
      log.validationId || '-',
      log.resultingStatus || '-',
      log.details || '-'
    ]);

    const tsvContent = [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + tsvContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sev-logs-${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
  },

  // Exportar para PDF (texto simples)
  exportToPDF: (logs: AuditLog[]): void => {
    const content = [
      'SEV - Sistema de Evidência de Validação',
      'Relatório de Logs de Auditoria',
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      `Total de registros: ${logs.length}`,
      '',
      '='.repeat(100),
      '',
      ...logs.map(log => [
        `Data/Hora: ${log.timestamp.toLocaleString('pt-BR')}`,
        `Usuário: ${log.user} (${log.department})`,
        `Ação: ${formatActionName(log.action)}`,
        log.system ? `Sistema: ${log.system}` : null,
        log.environment ? `Ambiente: ${log.environment}` : null,
        log.validationId ? `ID Validação: ${log.validationId}` : null,
        log.resultingStatus ? `Status: ${log.resultingStatus}` : null,
        log.details ? `Detalhes: ${log.details}` : null,
        '-'.repeat(100),
        ''
      ].filter(Boolean).join('\n')).join('\n')
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sev-logs-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  }
};

// Formatar nome da ação para exibição
export function formatActionName(action: string): string {
  const names: Record<string, string> = {
    'LOGIN_REALIZADO': 'Login Realizado',
    'LOGOUT_REALIZADO': 'Logout Realizado',
    'INICIO_VALIDACAO': 'Início de Validação',
    'SELECAO_AMBIENTE': 'Seleção de Ambiente',
    'UPLOAD_EVIDENCIA': 'Upload de Evidência',
    'ALTERACAO_STATUS': 'Alteração de Status',
    'ADICAO_COMENTARIO': 'Adição de Comentário',
    'FINALIZACAO_VALIDACAO': 'Finalização da Validação',
    'EXPORTACAO_RELATORIO': 'Exportação de Relatório',
    'CRIACAO_USUARIO': 'Criação de Usuário',
    'ALTERACAO_USUARIO': 'Alteração de Usuário',
    'DESATIVACAO_USUARIO': 'Desativação de Usuário',
    'ALTERACAO_ESTRUTURA': 'Alteração da Estrutura de Validação',
    'CONSULTA_VALIDACOES': 'Consulta de Validações Anteriores'
  };
  return names[action] || action;
}
