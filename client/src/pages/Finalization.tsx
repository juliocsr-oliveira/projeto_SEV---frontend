import { useEffect, useState } from 'react';
import { User, ValidationSession } from '../App';
import Header from '../components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Download, FileText, Table } from 'lucide-react';
import { auditLog } from '../utils/auditLog';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';

interface FinalizationProps {
  validation: ValidationSession;
  onComplete: (signature: string) => void;
  setExportComplete?: (value: boolean) => void;
  onBack: () => void;
  returnToHome: () => void;
  user: User;
}

export default function Finalization({ validation, onComplete, user, returnToHome }: FinalizationProps) {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const [validationData, setValidationData] = useState<ValidationSession | null>(null)
  const [signature, setSignature] = useState('');
  const [auditorConfirmation, setAuditorConfirmation] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const isAuditorOrAdmin = user.role === 'auditor' || user.role === 'administrador';

  useEffect(() => {
    const fetchValidation = async () => {
      try{
      const response = await api.get(
        `/validation-sessions/${validation.sessionId}/`
      )
      setValidationData(response.data)
    } catch (error) {
      console.error("Erro ao buscar dados da validação", error)
    }
    }

    fetchValidation()
  }, [validation.sessionId])

  if (!validationData) {
    return <div>Carregando...</div>
  }

  const executions = Array.isArray(validationData.executions)
    ? validationData.executions
    : []
    
  const stats = {
    ok: executions.filter(e => e.status === 'OK').length,
    failed: executions.filter(e => e.status === 'FALHOU').length,
    notApplicable: executions.filter(e => e.status === 'NAO_APLICA').length,
  }

  const formatDate = (date?: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleString('pt-Br')
  }

  const calculateDuration = () => {
    if (!validationData.finished_at || !validationData.started_at) return '-'

    const start = new Date(validationData.started_at).getTime()
    const end = new Date(validationData.finished_at).getTime()
    
    return `${Math.round((end - start) / 60000)} minutos`
  };


  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsExporting(true)

    try {

      await api.post(
        `/validation-sessions/${validation.sessionId}/finalize/`,
        {
          signature: signature
        }
      )

      setExportComplete(true)

    } catch (error) {

      console.error("Erro ao finalizar validação", error)

    } finally {

      setIsExporting(false)

    }
  };


return (
  <div className="min-h-screen bg-gray-50">
    <Header user={user} onLogout={() => {logout(); onNavigate('login');}}/>

    <main className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {!exportComplete ? (
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Finalização da Validação
              </h2>
              <p className="text-gray-600">
                Revise os dados e confirme para exportar
              </p>
            </div>

            <form onSubmit={handleFinalize} className="space-y-6">

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Resumo da Validação
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">

                  {validation.validationName && (
                    <div className="col-span-2">
                      <span className="text-gray-600"> Validação:</span>
                      <p className="font-semibold text-base">
                        {validation.validationName}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-gray-600">Sistema:</span>
                    <p className="font-semibold">{validationData.test_plan_system}</p>
                  </div>

                  <div>
                    <span className="text-gray-600">Ambiente:</span>
                    <p className="font-semibold">{validationData.test_plan_environment}</p>
                  </div>

                  <div>
                    <span className="text-gray-600">Divisão:</span>
                    <p className="font-semibold">{validationData.test_plan_division}</p>
                  </div>

                  {validation.gmudVersion && (
                    <div>
                      <span className="text-gray-600">Versão GMUD:</span>
                      <p className="font-semibold">{validation.gmudVersion}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-600">Executado por:</span>
                    <p className="font-semibold">{validationData?.started_by_name || 'Não executado'}</p>
                  </div>

                  <div>
                    <span className="text-gray-600"> Criado por:</span>
                    <p className="font-semibold">{validation.responsible || '-'}</p>
                  </div>

                  {validation.testerName && (
                    <div>
                      <span className="text-gray-600">Testador:</span>
                      <p className="font-semibold">{validation.testerName}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-600">Início:</span>
                    <p className="font-semibold">
                      {formatDate(validationData.started_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Estatísticas
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {stats.ok}
                    </div>
                    <div className="text-sm text-gray-600">OK</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {stats.failed}
                    </div>
                    <div className="text-sm text-gray-600">Falhou</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {stats.notApplicable}
                    </div>
                    <div className="text-sm text-gray-600">Não se aplica</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Assinatura Digital
                </h3>

                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Digite seu nome completo para confirmar"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Ao assinar, você confirma a veracidade das informações.
                </p>
              </div>

              {isAuditorOrAdmin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <label className="flex items-start gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={auditorConfirmation}
                      onChange={(e) =>
                        setAuditorConfirmation(e.target.checked)
                      }
                      required
                      className="mt-1 w-5 h-5 text-[#013171] border-gray-300 rounded"
                    />

                    <div>
                      <p className="font-semibold text-gray-800 mb-1">
                        Confirmação do Auditor
                      </p>

                      <p className="text-sm text-gray-700">
                        Confirmo que o teste foi realizado conforme o esperado
                        e que todas as evidências foram conferidas e estão
                        adequadas.
                      </p>
                    </div>

                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isExporting || exportComplete || !signature}
                className={`w-full py-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                  isExporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#013171] hover:bg-[#024a9f]'
                } text-white`}
              >
                {isExporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Finalizar e Exportar
                  </>
                )}
              </button>

            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Será gerado: PDF de relatório + Planilha com evidências
              </p>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center">

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Validação Concluída!
            </h2>

            <p className="text-gray-600 mb-8">
              Os documentos foram gerados com sucesso
            </p>

            <div className="space-y-3 max-w-sm mx-auto mb-8">

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="w-6 h-6 text-[#013171]" />

                <div className="text-left flex-1">
                  <p className="font-medium text-gray-800">Relatório PDF</p>
                  <p className="text-sm text-gray-600">
                    {`validacao_${validation.sessionId}.pdf`}
                  </p>
                </div>

                <Download className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Table className="w-6 h-6 text-[#013171]" />

                <div className="text-left flex-1">
                  <p className="font-medium text-gray-800">
                    Planilha Excel
                  </p>

                  <p className="text-sm text-gray-600">
                    {`validacao_${validation.sessionId}.xlsx`}
                  </p>
                </div>

                <Download className="w-5 h-5 text-gray-400" />
              </div>

            </div>

            <button
              onClick={returnToHome}
              className="bg-[#013171] hover:bg-[#024a9f] text-white py-3 rounded-md py-2 px-24 rounded-md transition-colors"
            >
              Voltar para página inicial
            </button>

          </div>
        )}
      </div>
    </main>
  </div>
)};