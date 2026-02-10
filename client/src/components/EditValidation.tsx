import { useState, useEffect } from 'react';
import { User, ValidationSession } from '../App';
import Header from './Header';
import { ArrowLeft, Edit, Lock, Calendar, AlertCircle } from 'lucide-react';

interface EditValidationProps {
  user: User;
  onBack: () => void;
  onEdit: (validation: ValidationSession) => void;
}

export default function EditValidation({ user, onBack, onEdit }: EditValidationProps) {
  const [validations, setValidations] = useState<ValidationSession[]>([]);
  const [showBlockedMessage, setShowBlockedMessage] = useState(false);

  useEffect(() => {
    // Carregar validações do histórico
    const history = JSON.parse(localStorage.getItem('sev-validations') || '[]');
    const userValidations = history
      .filter((v: any) => v.user === user.name)
      .map((v: any) => ({
        ...v,
        startTime: new Date(v.startTime),
        endTime: v.endTime ? new Date(v.endTime) : undefined
      }));
    setValidations(userValidations);
  }, [user]);

  const isEditableWithinDeadline = (validation: ValidationSession): boolean => {
    if (!validation.endTime) return true;

    const now = new Date();
    const endDate = validation.endTime;
    const diffInMs = now.getTime() - endDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Considerar apenas 1 dia útil (simplificado)
    return diffInDays <= 1;
  };

  const handleEditClick = (validation: ValidationSession) => {
    if (validation.status === 'aguardando_teste') {
      // Pode editar validações que ainda não foram realizadas
      onEdit(validation);
    } else if (isEditableWithinDeadline(validation)) {
      // Pode editar se estiver dentro do prazo
      onEdit(validation);
    } else {
      // Bloqueado
      setShowBlockedMessage(true);
      setTimeout(() => setShowBlockedMessage(false), 3000);
    }
  };

  const getStatusBadge = (validation: ValidationSession) => {
    const status = validation.status;
    const isEditable = isEditableWithinDeadline(validation);

    if (status === 'aguardando_teste') {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
          Pendente
        </span>
      );
    } else if (status === 'em_andamento') {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
          Em Execução
        </span>
      );
    } else if (status === 'concluida' && isEditable) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
          Concluída
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Bloqueada
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#013171] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Editar Validação</h2>
              <p className="text-gray-600 text-sm">
                Selecione uma validação para editar. Apenas validações dentro do prazo de 1 dia útil podem ser modificadas.
              </p>
            </div>

            {showBlockedMessage && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Validação Bloqueada</p>
                  <p className="text-sm text-red-700 mt-1">
                    Esta validação não pode mais ser editada pois ultrapassou o prazo de 1 dia útil após a conclusão.
                  </p>
                </div>
              </div>
            )}

            {validations.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhuma validação encontrada</p>
                <p className="text-gray-400 text-sm mt-2">
                  Crie uma nova validação para começar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {validations.map((validation) => {
                  const isEditable = validation.status === 'aguardando_teste' || isEditableWithinDeadline(validation);
                  
                  return (
                    <div
                      key={validation.id}
                      className={`border rounded-lg p-6 transition-all ${
                        isEditable 
                          ? 'border-gray-200 hover:border-[#013171] hover:shadow-md cursor-pointer' 
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                      onClick={() => handleEditClick(validation)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-1">
                            {validation.system} - {validation.environment}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Divisão: {validation.division}
                          </p>
                        </div>
                        {getStatusBadge(validation)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Data de Criação:</span>
                          <p className="font-medium">{validation.startTime.toLocaleDateString('pt-BR')}</p>
                        </div>
                        {validation.endTime && (
                          <div>
                            <span className="text-gray-500">Data de Conclusão:</span>
                            <p className="font-medium">{validation.endTime.toLocaleDateString('pt-BR')}</p>
                          </div>
                        )}
                        {validation.gmudNumber && (
                          <div>
                            <span className="text-gray-500">Número GMUD:</span>
                            <p className="font-medium">{validation.gmudNumber}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        {isEditable ? (
                          <div className="flex items-center gap-2 text-[#013171]">
                            <Edit className="w-4 h-4" />
                            <span className="text-sm font-medium">Clique para editar</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Lock className="w-4 h-4" />
                            <span className="text-sm">Edição bloqueada (prazo expirado)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Importante:</strong> Validações concluídas só podem ser editadas dentro de 1 dia útil após a finalização. 
                Após esse período, elas ficam bloqueadas e disponíveis apenas para consulta.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
