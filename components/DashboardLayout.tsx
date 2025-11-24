
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { PageKey } from '../types';
import DashboardPage from '../pages/DashboardPage';
import CadastroMonitoramento from '../pages/cadastro/CadastroMonitoramento';
import CadastroNatureza from '../pages/cadastro/CadastroNatureza';
import CadastroAreasLocalizacao from '../pages/cadastro/CadastroAreasLocalizacao';
import CadastroRepresentantes from '../pages/cadastro/CadastroRepresentantes';
import CadastroIcmra from '../pages/cadastro/CadastroIcmra';
import CadastroUsuarios from '../pages/cadastro/CadastroUsuarios';
import RelatorioMonitoramento from '../pages/relatorios/RelatorioMonitoramento';
import RelatorioRepresentantes from '../pages/relatorios/RelatorioRepresentantes';
import RelatorioMonitoramentosVerificados from '../pages/relatorios/RelatorioMonitoramentosVerificados';
import RelatorioCMA from '../pages/relatorios/RelatorioCMA';
import Placeholder from '../pages/Placeholder';
import RelatorioRiscoDetalhado from '../pages/relatorios/RelatorioRiscoDetalhado';

interface DashboardLayoutProps {
  onLogout: () => void;
  userRole: string;
  userName: string;
}

const pageComponents: Record<PageKey, React.ComponentType<any>> = {
    'dashboard': DashboardPage,
    'cadastro-monitoramento': CadastroMonitoramento,
    'cadastro-natureza': CadastroNatureza,
    'cadastro-areas-localizacao': CadastroAreasLocalizacao,
    'cadastro-representantes': CadastroRepresentantes,
    'cadastro-icmra': CadastroIcmra,
    'cadastro-usuarios': CadastroUsuarios,
    'relatorio-monitoramento': RelatorioMonitoramento,
    'relatorio-representantes': RelatorioRepresentantes,
    'relatorio-monitoramentos-verificados': RelatorioMonitoramentosVerificados,
    'relatorio-cma': RelatorioCMA,
    'relatorio-risco-detalhado': RelatorioRiscoDetalhado,
};

const pageTitles: Record<PageKey, string> = {
    'dashboard': 'Dashboard',
    'cadastro-monitoramento': 'Cadastro de Monitoramento',
    'cadastro-natureza': 'Cadastro de Natureza',
    'cadastro-areas-localizacao': 'Cadastro de Áreas',
    'cadastro-representantes': 'Cadastro de Representantes',
    'cadastro-icmra': 'Cadastro ICMRA',
    'cadastro-usuarios': 'Cadastro de Usuários',
    'relatorio-monitoramento': 'Relatório de Monitoramento',
    'relatorio-representantes': 'Relatório de Representantes',
    'relatorio-monitoramentos-verificados': 'Relatório de Monitoramentos Verificados',
    'relatorio-cma': 'Relatório CMA',
    'relatorio-risco-detalhado': 'Relatório de Risco Detalhado',
};


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout, userRole, userName }) => {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: PageKey, id?: string | number) => {
    setActivePage(page);
    setEditingId(id || null);
     if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const activePageTitle = pageTitles[activePage];

  const renderActivePageComponent = () => {
    // Access Control Check for component rendering
    if (activePage === 'cadastro-usuarios' && userRole !== 'ADMIN') {
         return <Placeholder title="Acesso Negado" message="Você não tem permissão para acessar esta página." />;
    }

    const Component = pageComponents[activePage];
    if (activePage === 'relatorio-monitoramento') {
      return <RelatorioMonitoramento onEdit={(id) => handleNavigate('cadastro-monitoramento', id)} />;
    }
    if (activePage === 'relatorio-cma') {
      return <RelatorioCMA onEdit={(id) => handleNavigate('cadastro-monitoramento', id)} />;
    }
    if (activePage === 'cadastro-monitoramento') {
      return <CadastroMonitoramento editingId={editingId} onCancelEdit={() => handleNavigate('relatorio-monitoramento')} />;
    }
    if(Component) {
        return <Component />;
    }
    return <Placeholder title="Página não encontrada" message="A página que você está procurando não existe."/>
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activePage={activePage} 
        setActivePage={handleNavigate}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        userRole={userRole}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            onLogout={onLogout} 
            pageTitle={activePageTitle}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            userName={userName}
            userRole={userRole}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {renderActivePageComponent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
