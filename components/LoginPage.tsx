
import React, { useState } from 'react';
import { ShieldCheckIcon } from './icons/IconComponents';

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setError('');
      setLoading(true);

      // SIMULAÇÃO DE LOGIN (MOCK)
      setTimeout(() => {
          // Simula um usuário Admin se o login for 'admin', caso contrário User comum
          const isAdmin = email.toLowerCase().includes('admin');
          
          const mockUser = {
              id: 1,
              nome: isAdmin ? 'Administrador' : 'Usuário Teste',
              email: email,
              role: isAdmin ? 'ADMIN' : 'USER'
          };

          const mockToken = 'mock-token-xyz-123';

          localStorage.setItem('token', mockToken);
          onLogin(mockUser);
          setLoading(false);
      }, 1000);

    } else {
      setError('Por favor, preencha todos os campos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col items-center">
            <div className="mb-2">
                {/* Imagem da ANVISA via URL */}
                <img 
                    src="https://fesaudesp.org.br/wp-content/uploads/2024/12/anvisa2-1024x576.jpg" 
                    alt="Logo ANVISA" 
                    className="h-24 w-auto object-contain"
                />
            </div>
          <h2 className="mt-2 text-3xl font-bold text-center text-gray-900">
            SIMRE-CEAVS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Monitoramento de Rumores e Eventos - CEAVS
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm text-blue-800 border border-blue-200">
                <strong>Modo de Desenvolvimento:</strong><br/>
                Use qualquer email/senha.<br/>
                Inclua "admin" no email para testar acesso total.
            </div>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email ou Login
              </label>
              <input
                id="email-address"
                name="email"
                type="text" 
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email ou Login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
