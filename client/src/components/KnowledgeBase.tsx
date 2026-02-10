import { useState } from 'react';
import { User } from '../App';
import Header from './Header';
import { ArrowLeft, ChevronDown, ChevronUp, BookOpen, CheckSquare, Lightbulb, GitBranch } from 'lucide-react';

interface KnowledgeBaseProps {
  onBack: () => void;
  user: User;
}

interface Section {
  id: string;
  title: string;
  icon: any;
  content: {
    subtitle: string;
    items: string[];
  }[];
}

export default function KnowledgeBase({ onBack, user }: KnowledgeBaseProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['como-testar']);

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const sections: Section[] = [
    {
      id: 'como-testar',
      title: 'Como Testar',
      icon: CheckSquare,
      content: [
        {
          subtitle: 'Preparação do Ambiente',
          items: [
            'Verifique se o ambiente está disponível e acessível',
            'Confirme que possui as credenciais necessárias',
            'Certifique-se de que a versão do sistema está atualizada',
            'Prepare os dados de teste necessários'
          ]
        },
        {
          subtitle: 'Execução dos Testes',
          items: [
            'Siga a ordem dos itens de validação apresentados',
            'Execute cada funcionalidade conforme descrito',
            'Anote qualquer comportamento inesperado',
            'Capture evidências (screenshots) de cada teste'
          ]
        },
        {
          subtitle: 'Registro de Resultados',
          items: [
            'Marque o status correto para cada item (OK, Falhou, Não se aplica)',
            'Anexe evidências para itens com status "OK" ou "Falhou"',
            'Adicione comentários detalhados em casos de falha',
            'Não deixe itens sem preenchimento'
          ]
        }
      ]
    },
    {
      id: 'exemplos-evidencia',
      title: 'Exemplos de Evidência',
      icon: BookOpen,
      content: [
        {
          subtitle: 'Screenshots Válidos',
          items: [
            'Capture a tela completa mostrando o resultado da ação',
            'Inclua data/hora visível no sistema quando possível',
            'Mostre mensagens de sucesso ou erro claramente',
            'Destaque elementos importantes com marcações'
          ]
        },
        {
          subtitle: 'O Que Evitar',
          items: [
            'Imagens cortadas ou com baixa resolução',
            'Screenshots sem contexto suficiente',
            'Evidências que não correspondem ao item testado',
            'Fotos de tela ao invés de capturas de tela'
          ]
        },
        {
          subtitle: 'Organização',
          items: [
            'Nomeie os arquivos de forma descritiva',
            'Mantenha a sequência lógica dos testes',
            'Use formatos de imagem padrão (PNG, JPG)',
            'Não envie arquivos muito grandes (máx. 5MB por imagem)'
          ]
        }
      ]
    },
    {
      id: 'boas-praticas',
      title: 'Boas Práticas',
      icon: Lightbulb,
      content: [
        {
          subtitle: 'Planejamento',
          items: [
            'Reserve tempo adequado para executar a validação completa',
            'Não execute validações em horários de pico do sistema',
            'Revise a estrutura de validação antes de iniciar',
            'Prepare um checklist adicional se necessário'
          ]
        },
        {
          subtitle: 'Durante a Validação',
          items: [
            'Não interrompa a validação após iniciada',
            'Documente imediatamente qualquer problema encontrado',
            'Tire dúvidas antes de marcar um item como "Falhou"',
            'Mantenha comunicação com a equipe técnica se necessário'
          ]
        },
        {
          subtitle: 'Após a Validação',
          items: [
            'Revise todos os itens antes de finalizar',
            'Verifique se todas as evidências foram anexadas',
            'Salve uma cópia local dos documentos gerados',
            'Comunique resultados críticos à equipe responsável'
          ]
        }
      ]
    },
    {
      id: 'versionamento',
      title: 'Instruções de Versionamento',
      icon: GitBranch,
      content: [
        {
          subtitle: 'Estrutura de Versões',
          items: [
            'Formato: MAJOR.MINOR.PATCH (ex: 2.1.0)',
            'MAJOR: Mudanças significativas na estrutura',
            'MINOR: Adição de novos itens de validação',
            'PATCH: Correções e ajustes em itens existentes'
          ]
        },
        {
          subtitle: 'Quando Criar Nova Versão',
          items: [
            'Ao adicionar ou remover itens de validação',
            'Quando houver mudanças nos critérios de aceitação',
            'Para refletir atualizações no sistema testado',
            'Após revisão e aprovação de auditoria'
          ]
        },
        {
          subtitle: 'Rastreabilidade',
          items: [
            'Cada validação registra a versão da estrutura utilizada',
            'Mantenha histórico de mudanças entre versões',
            'Documente o motivo de cada mudança de versão',
            'Comunique alterações a todos os validadores'
          ]
        }
      ]
    }
  ];

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

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-6">
            <div className="bg-[#013171] text-white p-6">
              <h2 className="text-2xl font-bold mb-2">Base de Conhecimento</h2>
              <p className="text-blue-200">Guias, instruções e boas práticas para validações</p>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Consulte esta base para obter orientações sobre como executar validações de forma eficaz e padronizada.
              </p>

              <div className="space-y-4">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isExpanded = expandedSections.includes(section.id);
                  
                  return (
                    <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-[#013171]" />
                          <h3 className="font-semibold text-gray-800">{section.title}</h3>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-6 space-y-6">
                          {section.content.map((subsection, index) => (
                            <div key={index}>
                              <h4 className="font-semibold text-gray-800 mb-3">
                                {subsection.subtitle}
                              </h4>
                              <ul className="space-y-2">
                                {subsection.items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="text-[#013171] mt-1">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Dúvidas?</strong> Entre em contato com a equipe de Qualidade ou Auditoria para esclarecimentos adicionais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
