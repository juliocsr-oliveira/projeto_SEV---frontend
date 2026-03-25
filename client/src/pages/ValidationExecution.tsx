import { User, ValidationSession, ValidationItem } from '../App';
import Header from '../components/Header';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, Upload, XCircle, MinusCircle } from 'lucide-react';
import { auditLog } from '../utils/auditLog';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '../components/ui/breadcrumb';
import { all } from 'axios';

interface ValidationExecutionProps {
  validation: ValidationSession;
  onUpdateItem: (itemId: string, updates: Partial<ValidationItem>) => void;
  onFinalize: () => void;
  onBack: () => void;
  user: User;
}

export default function ValidationExecution(props: ValidationExecutionProps) {
  const { User, isAuthenticated, logout } = useAuth();
  if (!props.validation) {
    console.log("VALIDATION AINDA NÃO SETADA");
    return <div>Carregando...</div>;
  }

  const { validation, user, onUpdateItem, onFinalize, onBack } = props;

  const handleStatusChange = async (itemId: string, status: ValidationItem['status']) => {

    if (!status) {
      onUpdateItem(itemId, {
        status: '',
        comment: '',
        evidence: null,
        evidencePreview: null,
        evidences: []
      });
      return;
    }

  onUpdateItem(itemId, { status })

  const executionId = validation.items.find(i => i.id === itemId)?.executionId
  if (!executionId) return

  try {

    await api.patch(`/test-executions/${executionId}/`, {
      status: status
    })

  } catch (error) {

    console.error("Erro atualizando status", error)

  }
}

const normalizedItems = validation.items.map(item => ({
  ...item,
  status: item.status === 'PENDENTE' ? '' : item.status
}));

const handleFileUpload = async (itemId: string, file: File) => {

  console.log("UPLOAD ITEM:", itemId)
  console.log("ITEMS:", validation.items)

  try {

    const reader = new FileReader()

    reader.onloadend = async () => {

      // preview no frontend
      onUpdateItem(itemId, {
        evidence: file,
        evidencePreview: reader.result as string
      })

      const executionId = validation.items.find(i => i.id === itemId)?.executionId

      console.log("executionId:", executionId)

      if (!executionId) {
        console.warn("Item sem executionId")
        return
      }

      const formData = new FormData()

      formData.append("test_execution", executionId)
      formData.append("file_type", "IMAGE")
      formData.append("file", file)

      const response = await api.post("/evidences/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      console.log("Evidência salva:", response.data)

    }

    reader.readAsDataURL(file)

  } catch (error: any) {
    console.log("UPLOAD ITEM:", itemId)
    console.log("ITEMS:", validation.items)
    console.error("Erro upload evidência:", error.response?.data || error)
    console.log("executionId:", executionId)
  }

}

const handleCommentChange = async (itemId: string, comment: string) => {

  onUpdateItem(itemId, { comment })

  const executionId = validation.items.find(i => i.id === itemId)?.executionId

  if (!executionId) return

  try {

    await api.patch(`/test-executions/${executionId}/`, {
      comment: comment
    })

  } catch (error) {

    console.error("Erro atualizando comentário", error)

  }
}

  const isItemValid = (item: ValidationItem) => {
    if (!item.status || item.status === 'PENDENTE') return false;

    const hasEvidence = 
      Boolean(item.evidencePreview) ||
      Boolean(item.evidences?.length);

    if (item.status === 'FALHOU' || item.status === 'NAO_APLICA') {
      if (!item.comment?.trim()) return false;
      if (!hasEvidence) return false;
    }

    return true; // OK
  };

  // Verificar se todos os itens estão preenchidos
  const allItemsValid = validation.items.length > 0 && validation.items.every(isItemValid);
  const canFinalize = allItemsValid;
  const totalItems = validation.items.length;
  const completedItems = validation.items.filter(item => item.status !== '').length;
  const evidenceCount = validation.items.filter(item => item.evidence !== null).length;

  console.log("VALIDATION NA EXECUÇÃO:", validation);
  console.log("VALIDAÇÃO ITEM A ITEM:", validation.items.map(i => ({
    id: i.id,
    status: i.status,
    valid: isItemValid(i),
  })));

  console.log("ITEMS NA EXECUÇÃO:", validation.items);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={() => {logout(); onNavigate('login');}}/>
      
      <main className="container mx-auto px-6 py-8">
        {/* Breadcrumb - mostrar apenas se a validação tem nome (criada pelo novo fluxo) */}
        {validation.validationName && (
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
                    3. Executar
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#013171] hover:text-[#024a9f] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-24">
          <div className="bg-[#013171] text-white p-6">
            <h2 className="text-2xl font-bold mb-2">Execução da Validação</h2>
            {validation.validationName && (
              <p className="text-lg font-semibold text-white/90 mb-4">
                {validation.validationName} 
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-200">Sistema:</span>
                <p className="font-medium">{validation.system || '-'}</p>
              </div>
              <div>
                <span className="text-blue-200">Ambiente:</span>
                <p className="font-medium">{validation.environment}</p>
              </div>
              <div>
                <span className="text-blue-200">Divisão:</span>
                <p className="font-medium">{validation.division}</p>
              </div>
              {validation.gmudNumber && (
                <div>
                  <span className="text-blue-200">GMUD:</span>
                  <p className="font-medium">{validation.gmudNumber}</p>
                </div>
              )}
              {validation.responsible && (
                <div>
                </div>
              )}
              {validation.validationStatus && (
                <div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-2/5">
                    Item de Validação
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/6">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/5">
                    Evidência
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/5">
                    Comentário
                  </th>
                </tr>
              </thead>
              <tbody>
                {validation.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <p className="text-sm text-gray-800">{item.item}</p>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as ValidationItem['status'])}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none ${
                          item.status === 'OK' ? 'bg-green-50 text-green-700' :
                          item.status === 'FALHOU' ? 'bg-red-50 text-red-700' :
                          item.status === 'NAO_APLICA' ? 'bg-gray-50 text-gray-700' :
                          ''
                        }`}
                      >
                        <option value="">Selecione</option>
                        <option value="OK">✓ OK</option>
                        <option value="NAO_APLICA">— Não se aplica</option>
                        <option value="FALHOU">✗ Falhou</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {item.status && item.status !== 'PENDENTE' && item.status !== '' &&(
                        <div>
                          {item.evidencePreview ? (
                            <div className="flex items-center gap-2">
                              <img 
                                src={item.evidencePreview} 
                                alt="Preview" 
                                className="w-12 h-12 object-cover rounded border border-gray-300"
                              />
                              <button
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) handleFileUpload(item.id, file);
                                  };
                                  input.click();
                                }}
                                className="text-xs text-[#013171] hover:underline"
                              >
                                Alterar
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center gap-2 cursor-pointer text-[#013171] hover:text-[#024a9f] transition-colors">
                              <Upload className="w-4 h-4" />
                              <span className="text-sm">Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(item.id, file);
                                }}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <input
                        type="text"
                        value={item.comment || ''}
                        onChange={(e) => handleCommentChange(item.id, e.target.value)}
                        placeholder="Adicionar comentário..."
                        className={`w-full px-3 py-2 border rounded-md text-sm outline-none ${
                          (item.status === 'FALHOU' || item.status === 'NAO_APLICA') && !item.comment
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Barra inferior fixa */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {allItemsValid ? (
              <span className="text-green-600 font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Todos os itens foram validados
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <MinusCircle className="w-5 h-5 text-yellow-600" />
                Preencha todos os itens para finalizar
              </span>
            )}
          </div>
          <button
            onClick={onFinalize}
            disabled={!canFinalize}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            title={!canFinalize ? 'Complete todos os itens e adicione pelo menos 1 evidência' : ''}
          >
            Finalizar Validação
          </button>
        </div>
      </div>
    </div>
  );
}