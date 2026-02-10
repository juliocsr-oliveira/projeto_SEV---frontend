import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { ChevronLeft, Upload, X } from 'lucide-react';

interface ValidationItem {
  id: string;
  description: string;
  status: 'OK' | 'Não se aplica' | 'Falhou' | '';
  evidence: File[];
  comment: string;
}

/**
 * Design: Tabela/Planilha de validação
 * - Colunas: Item, Status (dropdown), Evidência (upload), Comentário
 * - Barra inferior fixa com botão "Finalizar Validação"
 * - Botão desabilitado até todas as linhas preenchidas
 */
export default function ValidationExecution() {
  const { user, isAuthenticated, currentValidation } = useAuth();
  const [, navigate] = useLocation();
  const [items, setItems] = useState<ValidationItem[]>([
    { id: '1', description: 'Verificar login no sistema', status: '', evidence: [], comment: '' },
    { id: '2', description: 'Testar criação de novo registro', status: '', evidence: [], comment: '' },
    { id: '3', description: 'Validar edição de dados', status: '', evidence: [], comment: '' },
    { id: '4', description: 'Confirmar exclusão de registros', status: '', evidence: [], comment: '' },
  ]);

  useEffect(() => {
    if (!isAuthenticated || !currentValidation) {
      navigate('/home');
    }
  }, [isAuthenticated, currentValidation, navigate]);

  const handleStatusChange = (id: string, status: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, status: status as any } : item
    ));
  };

  const handleCommentChange = (id: string, comment: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, comment } : item
    ));
  };

  const handleFileUpload = (id: string, files: FileList | null) => {
    if (!files) return;
    setItems(items.map(item =>
      item.id === id ? { ...item, evidence: Array.from(files) } : item
    ));
  };

  const handleRemoveEvidence = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, evidence: [] } : item
    ));
  };

  const isComplete = items.every(item => item.status && item.evidence.length > 0);

  const handleFinalize = () => {
    if (isComplete) {
      navigate('/validation-summary');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-[#013171] hover:underline mb-6 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Informações da Validação */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Execução da Validação
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Divisão</p>
              <p className="font-medium">{currentValidation?.division}</p>
            </div>
            <div>
              <p className="text-gray-600">Sistema</p>
              <p className="font-medium">{currentValidation?.system}</p>
            </div>
            <div>
              <p className="text-gray-600">Ambiente</p>
              <p className="font-medium">{currentValidation?.environment}</p>
            </div>
            <div>
              <p className="text-gray-600">Testador</p>
              <p className="font-medium">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Tabela de Validação */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Item de Validação
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Evidência
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Comentário
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-4 py-4">
                      <Select value={item.status} onValueChange={(val) => handleStatusChange(item.id, val)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OK">OK</SelectItem>
                          <SelectItem value="Não se aplica">Não se aplica</SelectItem>
                          <SelectItem value="Falhou">Falhou</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Upload className="w-4 h-4 text-[#013171]" />
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileUpload(item.id, e.target.files)}
                            className="hidden"
                          />
                          <span className="text-xs text-[#013171] hover:underline">
                            {item.evidence.length > 0 ? `${item.evidence.length} arquivo(s)` : 'Upload'}
                          </span>
                        </label>
                        {item.evidence.length > 0 && (
                          <button
                            onClick={() => handleRemoveEvidence(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Textarea
                        placeholder="Adicione um comentário..."
                        value={item.comment}
                        onChange={(e) => handleCommentChange(item.id, e.target.value)}
                        className="text-xs h-12"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Indicador de Progresso */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm text-gray-600">
              {items.filter(i => i.status && i.evidence.length > 0).length} de {items.length} completos
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#013171] h-2 rounded-full transition-all"
              style={{
                width: `${(items.filter(i => i.status && i.evidence.length > 0).length / items.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </main>

      {/* Barra Inferior Fixa */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {isComplete ? '✓ Pronto para finalizar' : 'Preencha todos os campos para continuar'}
          </p>
          <Button
            onClick={handleFinalize}
            disabled={!isComplete}
            className="bg-[#013171] hover:bg-[#0a1f4a] text-white font-medium"
          >
            Finalizar Validação
          </Button>
        </div>
      </div>
    </div>
  );
}
