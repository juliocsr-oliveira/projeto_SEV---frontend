import { auditLog } from './auditLog';

// Função para popular logs de exemplo (apenas para demonstração)
export function seedDemoLogs() {
  // Verificar se já existem logs
  const existingLogs = auditLog.getAll();
  if (existingLogs.length > 0) {
    return; // Já existem logs, não precisa popular
  }

  // Criar validação pendente de exemplo para testadores
  const pendingValidation = {
    id: Date.now().toString(),
    user: 'Auditor Silva',
    department: 'Passageiros',
    division: 'Passageiros',
    system: 'Encomendas',
    environment: 'HMG',
    gmudVersion: 'v2.5.1',
    accessKey: 'VAL-DEMO-123456',
    startTime: new Date(),
    items: [],
    status: 'aguardando_teste',
    structureVersion: '2.1.0'
  };

  localStorage.setItem('sev-pending-validations', JSON.stringify([pendingValidation]));

  // Criar logs de demonstração
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  // Criar diversos logs de exemplo
  const demoLogs = [
    {
      user: 'Admin',
      department: 'TI',
      action: 'LOGIN_REALIZADO' as const,
      details: 'Login via email: admin@empresa.com',
      timestamp: threeDaysAgo
    },
    {
      user: 'Maria Santos',
      department: 'Qualidade',
      action: 'LOGIN_REALIZADO' as const,
      details: 'Login via email: maria@empresa.com',
      timestamp: threeDaysAgo
    },
    {
      user: 'João Silva',
      department: 'Passageiros',
      action: 'LOGIN_REALIZADO' as const,
      details: 'Login via email: joao@empresa.com',
      timestamp: twoDaysAgo
    },
    {
      user: 'João Silva',
      department: 'Passageiros',
      action: 'SELECAO_AMBIENTE' as const,
      system: 'Encomendas',
      environment: 'HMG',
      details: 'Divisão: Passageiros, GMUD: GMUD-2025-015',
      timestamp: twoDaysAgo
    },
    {
      user: 'João Silva',
      department: 'Passageiros',
      action: 'INICIO_VALIDACAO' as const,
      system: 'Encomendas',
      environment: 'HMG',
      validationId: '1737475200000',
      details: 'Divisão: Passageiros, Estrutura: v2.1.0',
      timestamp: twoDaysAgo
    },
    {
      user: 'João Silva',
      department: 'Passageiros',
      action: 'ALTERACAO_STATUS' as const,
      system: 'Encomendas',
      environment: 'HMG',
      validationId: '1737475200000',
      resultingStatus: 'OK',
      details: 'Item: Verificar autenticação de usuários',
      timestamp: twoDaysAgo
    },
    {
      user: 'João Silva',
      department: 'Passageiros',
      action: 'UPLOAD_EVIDENCIA' as const,
      system: 'Encomendas',
      environment: 'HMG',
      validationId: '1737475200000',
      details: 'Item: Verificar autenticação de usuários, Arquivo: screenshot.png',
      timestamp: twoDaysAgo
    },
    {
      user: 'João Silva',
      department: 'Passageiros',
      action: 'ADICAO_COMENTARIO' as const,
      system: 'Encomendas',
      environment: 'HMG',
      validationId: '1737475200000',
      details: 'Item: Validar fluxo de criação de registros',
      timestamp: twoDaysAgo
    },
    {
      user: 'João Silva',
      department: 'Passageiros',
      action: 'FINALIZACAO_VALIDACAO' as const,
      system: 'Encomendas',
      environment: 'HMG',
      validationId: '1737475200000',
      details: 'Total de itens: 12',
      timestamp: twoDaysAgo
    },
    {
      user: 'João Silva',
      department: 'Passageiros',
      action: 'EXPORTACAO_RELATORIO' as const,
      system: 'Encomendas',
      environment: 'HMG',
      validationId: '1737475200000',
      details: 'Exportação de PDF e Planilha',
      timestamp: twoDaysAgo
    },
    {
      user: 'Maria Santos',
      department: 'Qualidade',
      action: 'CONSULTA_VALIDACOES' as const,
      details: 'Acesso à tela de validações anteriores',
      timestamp: oneDayAgo
    },
    {
      user: 'Admin',
      department: 'TI',
      action: 'ALTERACAO_ESTRUTURA' as const,
      details: 'Nova versão: 2.2.0, Total de itens: 13',
      timestamp: oneDayAgo
    },
    {
      user: 'Admin',
      department: 'TI',
      action: 'CRIACAO_USUARIO' as const,
      details: 'Novo usuário: Pedro Costa - Setor: Cargas',
      timestamp: oneDayAgo
    },
    {
      user: 'Maria Santos',
      department: 'Qualidade',
      action: 'INICIO_VALIDACAO' as const,
      system: 'Jornada Digital',
      environment: 'PRD',
      validationId: '1737554400000',
      details: 'Divisão: Passageiros, Estrutura: v2.1.0',
      timestamp: oneDayAgo
    },
    {
      user: 'Maria Santos',
      department: 'Qualidade',
      action: 'ALTERACAO_STATUS' as const,
      system: 'Jornada Digital',
      environment: 'PRD',
      validationId: '1737554400000',
      resultingStatus: 'Falhou',
      details: 'Item: Testar integração com APIs externas',
      timestamp: oneDayAgo
    },
    {
      user: 'Admin',
      department: 'TI',
      action: 'LOGOUT_REALIZADO' as const,
      details: 'Logout do sistema',
      timestamp: now
    }
  ];

  // Salvar logs diretamente no localStorage
  const logsToSave = demoLogs.map((log, index) => ({
    id: `demo-log-${index}-${Date.now()}`,
    timestamp: log.timestamp,
    user: log.user,
    department: log.department,
    action: log.action,
    system: log.system,
    environment: log.environment,
    validationId: log.validationId,
    resultingStatus: log.resultingStatus,
    details: log.details
  }));

  localStorage.setItem('sev-audit-logs', JSON.stringify(logsToSave));
}