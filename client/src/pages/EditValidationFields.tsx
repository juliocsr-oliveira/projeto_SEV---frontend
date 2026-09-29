import { useState, useEffect } from 'react';
import { User } from '@/App';
import { ValidationDraft } from './CreateValidation';
import { SelectedSystem } from './SystemSelection';
import api from '@/services/api';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Plus, Trash2, AlertCircle, Download, Upload, FileSpreadsheet, CheckCircle2, XCircle } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '../components/ui/breadcrumb';

export interface ValidationField {
  id: string;
  description: string;
  order_index: number;
}

interface ImportResult {
  message: string;
  total_linhas_lidas: number;
  criados: number;
  duplicados_ignorados: { linha: number; descricao: string }[];
  erros: { linha: number; mensagem: string }[];
}

export default function EditValidationFields({ 
  validationDraft, 
  selectedSystems,
  onNext, 
  onBack, 
  user 
}: EditValidationFieldsProps) {
  const { user: authUser, logout } = useAuth();
  const [fields, setFields] = useState<ValidationField[]>([]);
  const [loading, seetLoading] = useState(true);
  const [selectedSetor, setSelectedSetor] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [error, setError] = useState('');
  const [testPlan, setTestPlan] = useState<any>(null);

  // --- Importação via Excel ---
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState('');

  const fetchFields = async () => {
    try {
      if (!selectedSetor) return;
      setFields([]);

      const response = await api.get("/test-case/", {
        params: {
          test_plan: validationDraft.id,
          setor: selectedSetor,
          active: true
        }
      });

      setFields(response.data.results || response.data);
    
  } catch (error) {
    console.error("Erro ao buscar campos", error);
  }
};

useEffect(() => {
  if (validationDraft?.id && selectedSetor) {
    setFields([]);
    fetchFields();
  }
}, [validationDraft.id, selectedSetor]);

useEffect(() => {
  const fetchTestPlan = async () => {
    try {
      const response = await api.get(`/test-plans/${validationDraft.id}/`);

      setTestPlan(response.data);

      if (response.data.setores?.length > 0) {
        setSelectedSetor(response.data.setores[0]);
      }

    } catch (error) {
      console.error("Erro ao carregar test-plan", error);
    } finally {
      seetLoading(false);
    }
  };

  if (validationDraft?.id) {
    fetchTestPlan();
  }
}, [validationDraft.id]);

useEffect(() => {
  if (testPlan?.setores?.length > 0) {
    setSelectedSetor(testPlan.setores[0]);
  }
}, [testPlan]);

const handleAddField = async () => {
  try {
    await api.post("/test-case/", {
      description: newFieldName,
      test_plan: validationDraft.id,
      setor: selectedSetor,
      active: true
    });

    setNewFieldName("");

    fetchFields();
  } catch (error) {
    console.error("Erro ao adicionar campo:", error.response?.data);
    console.log("ENVIANDO SETOR:", selectedSetor);
    console.log("FIELDS API:", Response.data);
  }
};

const handleRemoveField = async (id: string) => {
  try {
    await api.delete(`/test-case/${id}/`);

    setFields(fields.filter(field => field.id !== id));

    fetchFields();

  } catch (error) {
    console.error("Erro ao remover campo:", error);
  }
};

const handleDownloadTemplate = async () => {
  try {
    setDownloadingTemplate(true);

    const response = await api.get(`/test-plans/${validationDraft.id}/download-template/`, {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `modelo_itens_${validationDraft.name}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Erro ao baixar modelo:", error);
    setImportError('Não foi possível baixar o modelo. Tente novamente.');
  } finally {
    setDownloadingTemplate(false);
  }
};

const handleImportFile = async () => {
  if (!importFile) {
    setImportError('Selecione um arquivo .xlsx antes de importar.');
    return;
  }

  if (!selectedSetor) {
    setImportError('Selecione um setor antes de importar.');
    return;
  }

  setImporting(true);
  setImportError('');
  setImportResult(null);

  try {
    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('setor', selectedSetor);

    const response = await api.post(
      `/test-plans/${validationDraft.id}/import-test-cases/`,
      formData,
      { headers: { 'Content-Type': undefined } }
    );

    setImportResult(response.data);
    setImportFile(null);

    fetchFields();

  } catch (error: any) {
    console.error("Erro ao importar planilha:", error.response?.data);
    setImportError(error.response?.data?.error || 'Erro ao importar a planilha. Verifique o arquivo e tente novamente.');
  } finally {
    setImporting(false);
  }
};

const handleMoveUp = (index: number) => {
  if (index === 0) return;

  const newFields = [...fields];

  [newFields[index - 1], newFields[index]] = 
  [newFields[index], newFields[index - 1]];

  setFields(newFields);
};

const handleMoveDown = (index: number) => {
  if (index === fields.length - 1) return;

  const newFields = [...fields];

  [newFields[index], newFields[index + 1]] = 
  [newFields[index + 1], newFields[index]];

  setFields(newFields);
};

const handleSubmit = async () => {

  try {

    if (fields.length === 0) {
      setError("Adicione pelo menos um campo de validação");
      return;
    }

      const check = await api.get(`/test-plans/${validationDraft.id}/`);
      console.log("SETOR NO BACK:", check.data.setores);

      await api.post(`/test-plans/${validationDraft.id}/preparar/`);
      await api.post(`/test-plans/${validationDraft.id}/generate-keys/`, {
        keys: testPlan.setores
      });
      const response = await api.get(`/test-plans/${validationDraft.id}/`);

      onNext(response.data);

    } catch (error:any) {
      console.error("Erro ao adicionar campo:", error);
      
      if (error.response?.data) {
        console.log("Error backend:", error.response.data);
        console.log(JSON.stringify(error.response.data, null, 2));
      }

      setError("Erro ao continuar.");
    }

};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={(logout)}/>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={onBack}
                    className="text-gray-500 hover:text-[#013171] cursor-pointer"
                  >
                    1. Criar Validação
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={onBack}
                    className="text-gray-500 hover:text-[#013171] cursor-pointer"
                  >
                    2. Selecionar Sistema
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#013171] font-medium">
                    3. Editar Campos de Validação
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Cabeçalho */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#013171] hover:text-[#024a9f] mb-4 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Editar Campos de Validação
            </h1>
            <p className="text-gray-600">
              Configure os campos que serão validados para <strong>{validationDraft.name}</strong>
            </p>
          </div>
              {testPlan && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-[#013171]">
                  
                  <h2 className="text-lg font-semibold text-[#013171] mb-4">
                    Selecionar Setor
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Setor
                    </label>

                    <select
                      value={selectedSetor}
                      onChange={(e) => setSelectedSetor(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#013171] focus:border-transparent outline-none"
                    >
                      {testPlan.setores.map((setor) => (
                        <option key={setor} value={setor}>
                          {setor}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>
              )}

          {/* Informações da Validação */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-[#013171]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nome da Validação</p>
                <p className="font-medium text-gray-900">{validationDraft.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo</p>
                <p className="font-medium text-gray-900">{validationDraft.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sistema Selecionado</p>
                <p className="font-medium text-gray-900">{selectedSystems.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Campos</p>
                <p className="font-medium text-gray-900">{fields.length}</p>
              </div>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Lista de Campos Existentes */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-[#013171]">
            <h2 className="text-lg font-semibold text-[#013171] mb-4">Campos Atuais</h2>
            
            {fields.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum campo adicionado ainda</p>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#013171] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#013171] text-white text-xs font-semibold">
                            {index + 1}
                          </span>
                          <h3 className="font-medium text-gray-900">{field.description}</h3>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-500 hover:text-[#013171] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Mover para cima"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === fields.length - 1}
                          className="p-2 text-gray-500 hover:text-[#013171] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Mover para baixo"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoveField(field.id)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          title="Remover campo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Importar Itens via Excel */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-[#013171]">
            <div className="flex items-center gap-3 mb-4">
              <FileSpreadsheet className="w-5 h-5 text-[#013171]" />
              <h2 className="text-lg font-semibold text-[#013171]">Importar Itens via Excel</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Ao invés de cadastrar item por item, baixe o modelo, preencha em massa e faça o upload.
              Os itens serão adicionados ao setor selecionado acima (<strong>{selectedSetor || '— selecione um setor —'}</strong>).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={downloadingTemplate}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-[#013171] text-[#013171] rounded-lg hover:bg-blue-50 transition-colors font-medium disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloadingTemplate ? 'Baixando...' : 'Baixar modelo (.xlsx)'}
              </button>

              <label className="flex-1 flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#013171] transition-colors">
                <Upload className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 truncate">
                  {importFile ? importFile.name : 'Selecionar arquivo .xlsx preenchido'}
                </span>
                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={(e) => {
                    setImportFile(e.target.files?.[0] || null);
                    setImportError('');
                    setImportResult(null);
                  }}
                />
              </label>

              <button
                type="button"
                onClick={handleImportFile}
                disabled={!importFile || importing}
                className="px-6 py-2 bg-[#013171] text-white rounded-lg hover:bg-[#024a9f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? 'Importando...' : 'Importar'}
              </button>
            </div>

            {importError && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {importError}
              </div>
            )}

            {importResult && (
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  {importResult.criados} item(ns) importado(s) de {importResult.total_linhas_lidas} linha(s) lida(s).
                </div>

                {importResult.duplicados_ignorados.length > 0 && (
                  <div className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800">
                    <p className="font-medium mb-1">
                      {importResult.duplicados_ignorados.length} linha(s) ignorada(s) por já existirem:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {importResult.duplicados_ignorados.map((d, i) => (
                        <li key={i}>Linha {d.linha}: {d.descricao}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {importResult.erros.length > 0 && (
                  <div className="text-sm bg-red-50 border border-red-200 rounded-lg p-3 text-red-800">
                    <p className="font-medium mb-1 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      {importResult.erros.length} linha(s) com erro:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {importResult.erros.map((e, i) => (
                        <li key={i}>Linha {e.linha}: {e.mensagem}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Adicionar Novo Campo */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-[#013171]">
            <h2 className="text-lg font-semibold text-[#013171] mb-4">Adicionar Novo Campo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Campo *
                </label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="Ex: Verificar permissões de acesso"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#013171] focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                </div>
              <button
                onClick={handleAddField}
                className="w-full bg-[#013171] text-white px-4 py-2 rounded-lg hover:bg-[#024a9f] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Campo
              </button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Voltar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-[#013171] text-white rounded-lg hover:bg-[#024a9f] transition-colors font-medium"
            >
              Continuar para Validação Criada
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}