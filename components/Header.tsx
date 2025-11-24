
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftOnRectangleIcon, Bars3Icon, BellIcon, UserCircleIcon, KeyIcon, XMarkIcon } from './icons/IconComponents';

interface HeaderProps {
  onLogout: () => void;
  pageTitle: string;
  toggleSidebar: () => void;
  userName?: string;
  userRole?: string;
}

const Header: React.FC<HeaderProps> = ({ onLogout, pageTitle, toggleSidebar, userName, userRole }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside listener to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert('As novas senhas não coincidem.');
        return;
    }
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
        alert('Preencha todos os campos.');
        return;
    }
    // Simulate API call
    alert('Senha alterada com sucesso!');
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none md:hidden">
            <Bars3Icon className="w-6 h-6"/>
        </button>
        <h1 className="text-2xl font-semibold text-gray-700 ml-4">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center">
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none mx-2">
          <BellIcon className="w-6 h-6" />
        </button>
        
        <div className="relative ml-2" ref={menuRef}>
            <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="focus:outline-none text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
                <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-gray-700">{userName || 'Usuário'}</p>
                    <p className="text-xs text-gray-500">{userRole || 'Convidado'}</p>
                </div>
                <UserCircleIcon className="w-8 h-8"/>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{userName || 'Usuário'}</p>
                        <p className="text-xs text-gray-500">{userRole}</p>
                    </div>
                    <button 
                        onClick={() => {
                            setShowUserMenu(false);
                            setShowPasswordModal(true);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <KeyIcon className="w-4 h-4 mr-2" />
                        Alterar Senha
                    </button>
                    <button 
                        onClick={() => {
                            setShowUserMenu(false);
                            onLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
                        Sair
                    </button>
                </div>
            )}
        </div>

        <button onClick={onLogout} className="flex items-center text-gray-500 hover:text-blue-600 focus:outline-none mx-4" title="Sair">
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          <span className="hidden md:inline ml-1">Sair</span>
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button 
                    onClick={() => setShowPasswordModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4">Alterar Senha</h3>
                
                <form onSubmit={submitPasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                        <input 
                            type="password" 
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                        <input 
                            type="password" 
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button 
                            type="button"
                            onClick={() => setShowPasswordModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Salvar Senha
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;
