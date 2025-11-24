
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Check for existing token and user data on load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserRole(parsedUser.role || 'USER');
        setUserName(parsedUser.nome || 'Usuário');
    }
  }, []);

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUserRole(userData.role);
    setUserName(userData.nome);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setUserName('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="bg-base-100 min-h-screen">
      {isLoggedIn ? (
        <DashboardLayout 
            onLogout={handleLogout} 
            userRole={userRole} 
            userName={userName}
        />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
