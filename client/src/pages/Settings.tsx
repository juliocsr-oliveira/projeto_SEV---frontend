import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { ChevronLeft, Settings as SettingsIcon, Users, FileText, BarChart3 } from 'lucide-react';

/**
 * Design: Grid de configurações
 * - Cards para: Gerenciar Estrutura, Gerenciar Usuários, Base de Conhecimento
 * - Apenas para Admin e Auditor
 */
export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'auditor')) {
      navigate('/home');
    }
  }, [isAuthenticated, user, navigate]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const settingsOptions = [
    {
      id: 'structure',
      title: 'Gerenciar Estrutura de Validação',
      description: 'Criar, editar e versionar estruturas de validação',
      icon: FileText,
      onClick: () => handleNavigate('/edit-structure'),
      visible: true,
    },
    {
      id: 'users',
      title: 'Gerenciar Utilizadores',
      description: 'Criar, editar e desativar utilizadores do sistema',
      icon: Users,
      onClick: () => handleNavigate('/manage-users'),
      visible: user?.role === 'admin',
    },
    {
      id: 'logs',
      title: 'Extrair Logs',
      description: 'Visualizar e exportar logs de auditoria do sistema',
      icon: BarChart3,
      onClick: () => handleNavigate('/logs'),
      visible: user?.role === 'admin',
    },
    {
      id: 'knowledge',
      title: 'Base de Conhecimento',
      description: 'Gerenciar conteúdo da base de conhecimento',
      icon: SettingsIcon,
      onClick: () => handleNavigate('/knowledge-base'),
      visible: true,
    },
  ];

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
          Configurações
        </h1>
        <p className="text-gray-600 mb-8">
          Gerencie as configurações do sistema SEV
        </p>

        {/* Grid de Opções */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {settingsOptions.map((option) => {
            if (!option.visible) return null;

            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={option.onClick}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#013171] text-white p-3 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Informação do Perfil */}
        <div className="max-w-4xl mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Seu Perfil
          </h3>
          <div className="text-blue-800">
            <p><strong>Nome:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Função:</strong> <span className="capitalize">{user?.role}</span></p>
            <p><strong>Setor:</strong> {user?.sector}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
