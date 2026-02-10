import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';

interface KnowledgeSection {
  id: string;
  title: string;
  content: string;
}

/**
 * Design: Página de FAQ com seções expansíveis
 * - Seções: Como testar, Exemplos de evidência, Boas práticas, Versionamento
 */
export default function KnowledgeBase() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['1']);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const sections: KnowledgeSection[] = [
    {
      id: '1',
      title: 'Como Testar',
      content: `
        1. Acesse o sistema com suas credenciais
        2. Clique em "Iniciar Validação" (para testadores, insira a chave fornecida pelo auditor)
        3. Preencha cada item de validação com:
           - Status: OK, Não se aplica ou Falhou
           - Evidência: Faça upload de prints/imagens
           - Comentário: Adicione observações se necessário
        4. Finalize a validação após preencher todos os campos
        5. Confirme com sua senha para assinatura digital
        6. Exporte o relatório em PDF ou XLSX
      `,
    },
    {
      id: '2',
      title: 'Exemplos de Evidência',
      content: `
        Exemplos de boas evidências:
        
        ✓ Screenshots claros do sistema testado
        ✓ Imagens com data/hora visível
        ✓ Prints mostrando mensagens de sucesso/erro
        ✓ Comprovantes de ações realizadas
        ✓ Logs de sistema relevantes
        
        Evite:
        ✗ Imagens desfocadas ou cortadas
        ✗ Prints sem contexto
        ✗ Imagens muito grandes (>5MB)
        ✗ Documentos em formatos não suportados
      `,
    },
    {
      id: '3',
      title: 'Boas Práticas',
      content: `
        Para garantir validações de qualidade:
        
        1. Teste em ambiente apropriado (QA, HMG, PRD)
        2. Siga o plano de testes fornecido pelo auditor
        3. Documente cada passo com evidências
        4. Adicione comentários explicativos quando necessário
        5. Reporte bloqueios ou problemas imediatamente
        6. Não modifique dados de produção durante testes
        7. Mantenha a rastreabilidade de todas as ações
      `,
    },
    {
      id: '4',
      title: 'Instruções de Versionamento',
      content: `
        Versionamento de Estruturas de Validação:
        
        - Cada estrutura de validação recebe um número de versão
        - Alterações criam uma nova versão automaticamente
        - Histórico completo é mantido para auditoria
        - Versões anteriores podem ser consultadas
        - GMUD (Gestão de Mudanças) é obrigatória para rastreabilidade
        
        Formato de Versão: v1.0, v1.1, v2.0, etc.
        Cada validação registra a versão utilizada
      `,
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Base de Conhecimento
        </h1>
        <p className="text-gray-600 mb-8">
          Encontre respostas e orientações para usar o sistema SEV
        </p>

        {/* Seções Expansíveis */}
        <div className="max-w-3xl mx-auto space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h2>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    expandedSections.includes(section.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSections.includes(section.id) && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Seção de Suporte */}
        <div className="max-w-3xl mx-auto mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Precisa de Ajuda?
          </h3>
          <p className="text-blue-800">
            Se não encontrou a resposta que procura, contacte o administrador do sistema ou consulte a documentação técnica.
          </p>
        </div>
      </main>
    </div>
  );
}
