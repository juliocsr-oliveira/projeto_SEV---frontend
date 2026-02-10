import { useState } from 'react';
import { User, ValidationSession } from '../App';
import Header from './Header';
import { ArrowLeft, Key, AlertCircle } from 'lucide-react';
import { auditLog } from '../utils/auditLog';

interface EnterKeyProps {
  onBack: () => void;
  onValidKey: (validation: ValidationSession) => void;
  user: User;
}

export default function EnterKey({ onBack, onValidKey, user }: EnterKeyProps) {
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    // Simular validação de chave
    setTimeout(() => {
      // Buscar validações pendentes no localStorage
      const pendingValidations = JSON.parse(localStorage.getItem('sev-pending-validations') || '[]');
      const validation = pendingValidations.find((v: any) => v.accessKey === accessKey);

      if (validation) {
        // Chave válida - converter para ValidationSession
        const validationSession: ValidationSession = {
          ...validation,
          startTime: new Date(validation.startTime),
          testerName: user.name,
          status: 'em_andamento'
        };

        // Registrar log
        auditLog.register({
          user: user.name,
          department: user.department,
          action: 'INICIO_VALIDACAO',
          system: validation.system,
          environment: validation.environment,
          validationId: validation.id,
          details: `Acesso via chave: ${accessKey}`
        });

        onValidKey(validationSession);
      } else {
        setError('Chave inválida ou validação não encontrada');
        setIsValidating(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#013171] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#013171] p-3 rounded-lg">
                <Key className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Inserir Chave de Acesso</h2>
                <p className="text-gray-600 text-sm">
                  Digite a chave fornecida pelo auditor para iniciar a validação
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="accessKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Chave de Acesso
                </label>
                <input
                  id="accessKey"
                  type="text"
                  value={accessKey}
                  onChange={(e) => {
                    setAccessKey(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="Ex: VAL-2025-ABC123"
                  required
                  maxLength={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none font-mono text-lg tracking-wider"
                />
                <p className="mt-2 text-xs text-gray-500">
                  A chave de acesso deve ser fornecida pelo auditor responsável
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Erro ao validar chave</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Importante:</strong> A chave de acesso é única para cada validação. 
                  Se você não possui uma chave, solicite ao auditor responsável pela validação.
                </p>
              </div>

              <button
                type="submit"
                disabled={isValidating || !accessKey}
                className="w-full bg-[#013171] text-white py-3 rounded-md hover:bg-[#024a9f] transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isValidating ? 'Validando chave...' : 'Validar e Iniciar'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
