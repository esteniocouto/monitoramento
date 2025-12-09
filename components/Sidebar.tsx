
import React, { useState } from 'react';
import { PageKey, MenuItem } from '../types';
import {
  ChartPieIcon, DocumentTextIcon, FolderPlusIcon, MapPinIcon,
  ChevronDownIcon, ChevronRightIcon, UsersIcon, GlobeAltIcon, HomeIcon,
  CheckBadgeIcon,
  ClipboardDocumentListIcon,
  ChartBarSquareIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  TagIcon,
  ExclamationTriangleIcon
} from './icons/IconComponents';

interface SidebarProps {
  activePage: PageKey;
  setActivePage: (page: PageKey, id?: string | number) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole: string;
}

const cadastroItems: MenuItem[] = [
  { key: 'cadastro-monitoramento', label: 'Monitoramento', icon: ChartPieIcon },
  { key: 'cadastro-natureza', label: 'Natureza', icon: GlobeAltIcon },
  { key: 'cadastro-areas-localizacao', label: 'Áreas', icon: MapPinIcon },
  { key: 'cadastro-representantes', label: 'Representantes', icon: UsersIcon },
  { key: 'cadastro-icmra', label: 'ICMRA', icon: ShieldCheckIcon },
  { key: 'cadastro-status', label: 'Status', icon: TagIcon },
  { key: 'cadastro-usuarios', label: 'Usuários', icon: UserCircleIcon, adminOnly: true }, // Restricted
];

const relatoriosItems: MenuItem[] = [
  { key: 'relatorio-monitoramento', label: 'Monitoramento', icon: DocumentTextIcon },
  { key: 'relatorio-representantes', label: 'Representantes', icon: DocumentTextIcon },
  { key: 'relatorio-monitoramentos-verificados', label: 'Verificados', icon: CheckBadgeIcon },
  { key: 'relatorio-nao-verificados', label: 'Não Verificados', icon: ExclamationTriangleIcon },
  { key: 'relatorio-cma', label: 'Relatório CMA', icon: ClipboardDocumentListIcon },
  { key: 'relatorio-risco-detalhado', label: 'Risco Detalhado', icon: ChartBarSquareIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen, userRole }) => {
  const [isCadastroOpen, setCadastroOpen] = useState(true);
  const [isRelatoriosOpen, setRelatoriosOpen] = useState(true);

  const handleNavigation = (page: PageKey) => {
    setActivePage(page);
    if (window.innerWidth < 768) { // md breakpoint
      setIsOpen(false);
    }
  };

  // Helper to filter items by role
  const filterItems = (items: MenuItem[]) => {
      return items.filter(item => !item.adminOnly || userRole === 'ADMIN');
  };

  const NavLink: React.FC<{ item: MenuItem; isSubItem?: boolean }> = ({ item, isSubItem = false }) => {
    const isActive = activePage === item.key;
    return (
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); handleNavigation(item.key); }}
        className={`flex items-center p-2 text-base font-normal rounded-lg transition-all duration-200 ${isSubItem ? 'pl-11' : ''} ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
      >
        <item.icon className={`w-6 h-6 transition duration-75 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
        <span className="ml-3 flex-1 whitespace-nowrap">{item.label}</span>
      </a>
    );
  };
  
  const CollapsibleMenu: React.FC<{
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    items: MenuItem[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }> = ({ title, icon: Icon, items, isOpen, setIsOpen }) => {
    const visibleItems = filterItems(items);
    if (visibleItems.length === 0) return null;

    const isAnyChildActive = visibleItems.some(item => item.key === activePage);
    return (
      <li>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-all duration-200 group ${isAnyChildActive ? 'text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          <Icon className={`w-6 h-6 transition duration-75 ${isAnyChildActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
          <span className="flex-1 ml-3 text-left whitespace-nowrap">{title}</span>
          {isOpen ? <ChevronDownIcon className="w-6 h-6"/> : <ChevronRightIcon className="w-6 h-6"/>}
        </button>
        <ul className={`py-2 space-y-2 ${!isOpen ? 'hidden' : ''}`}>
          {visibleItems.map(item => (
            <li key={item.key}><NavLink item={item} isSubItem /></li>
          ))}
        </ul>
      </li>
    );
  };

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-neutral transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Meu Painel</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li><NavLink item={{key: 'dashboard', label: 'Dashboard', icon: HomeIcon}} /></li>
            <CollapsibleMenu title="Cadastro" icon={FolderPlusIcon} items={cadastroItems} isOpen={isCadastroOpen} setIsOpen={setCadastroOpen} />
            <CollapsibleMenu title="Relatórios" icon={DocumentTextIcon} items={relatoriosItems} isOpen={isRelatoriosOpen} setIsOpen={setRelatoriosOpen} />
          </ul>
        </nav>
      </aside>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default Sidebar;
