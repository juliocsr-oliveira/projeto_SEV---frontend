import { useState } from 'react';
import { User } from '../App';
import { ValidationDraft } from './CreateValidation';
import { SelectedSystem } from './SystemSelection';
import Header from '../components/Header';
import { Check, Copy, ArrowLeft, Key } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '../components/ui/breadcrumb';

interface ValidationCreatedProps {
  validationDraft: ValidationDraft;
  selectedSystems: SelectedSystem[];
  onComplete: () => void;
  onCreateAnother: () => void;
  user: User;
}

export default function ValidationCreated({ 
  validationDraft, 
  selectedSystems, 
  onComplete,
  onCreateAnother,
  user 
}: ValidationCreatedProps) {
  const [keyCopied, setKeyCopied] = useState(false);

  // Gerar chave de acesso única
  const accessKey = validationDraft.accessKey;

  const copyKeyToClipboard = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(accessKey);
        setKeyCopied(true);
        setTimeout(() => setKeyCopied(false), 2000);
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = accessKey;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          document.execCommand('copy');
          setKeyCopied(true);
          setTimeout(() => setKeyCopied(false), 2000);
        } catch (err) {
          console.error('Fallback: Could not copy text', err);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-gray-500">
                    1. Criar Validação
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-gray-500">
                    2. Selecionar Sistema
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#013171] font-medium">
                    3. Validação Criada
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Ícone de sucesso */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Validação Criada com Sucesso!
              </h2>
              <p className="text-gray-600">
                Compartilhe a chave de acesso com o testador responsável
              </p>
            </div>

            {/* Informações da Validação */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">📋 Detalhes da Validação</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nome:</span>
                  <p className="font-medium text-gray-800">{validationDraft.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <p className="font-medium text-gray-800">{validationDraft.type}</p>
                </div>
                <div>
                  <span className="text-gray-600">Divisão:</span>
                  <p className="font-medium text-gray-800">{validationDraft.division}</p>
                </div>
                <div>
                  <span className="text-gray-600">Criado por:</span>
                  <p className="font-medium text-gray-800">{validationDraft.createdBy}</p>
                </div>
              </div>
            </div>

            {/* Sistemas Selecionados */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">🖥️ Sistemas e Ambientes</h3>
              <div className="space-y-2">
                {selectedSystems.map((sys, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-800">{sys.system}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{sys.environment}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chave de Acesso */}
            <div className="bg-gradient-to-r from-[#013171] to-[#024a9f] rounded-lg p-6 mb-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-6 h-6" />
                <h3 className="font-bold text-lg">Chave de Acesso</h3>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
                <input
                  type="text"
                  value={accessKey}
                  readOnly
                  className="w-full bg-transparent text-white font-mono text-xl text-center tracking-wider outline-none"
                />
              </div>
              <button
                onClick={copyKeyToClipboard}
                className="w-full bg-white text-[#013171] px-6 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                {keyCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Chave Copiada!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copiar Chave
                  </>
                )}
              </button>
            </div>

            {/* Instruções */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4 mb-6">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-yellow-600">⚠️</span>
                Instruções Importantes
              </h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-6 list-disc">
                <li>Envie esta chave ao testador responsável pela execução</li>
                <li>A chave é única e permite acesso exclusivo a esta validação</li>
                <li>O testador deve usar a opção "Iniciar Validação" e inserir a chave</li>
                <li>Esta validação ficará disponível em "Validações Anteriores"</li>
              </ul>
            </div>

            {/* Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-green-700">Status:</span> Aguardando Execução pelo Testador
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4">
              <button
                onClick={onCreateAnother}
                className="flex-1 bg-[#013171] text-white py-3 rounded-md hover:bg-[#024a9f] transition-colors font-medium"
              >
                Criar Outra Validação
              </button>
              <button
                onClick={onComplete}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}