
import React, { useState } from 'react';
import { Input, FormField, Select } from '../../components/forms/FormControls';

const CadastroUsuarios: React.FC = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        login: '',
        password: '',
        confirmPassword: '',
        perfil: 'USER'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não conferem.');
            return;
        }

        if (!formData.nome || !formData.email || !formData.login || !formData.password) {
            setError('Preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);
        
        // SIMULAÇÃO DE CADASTRO
        setTimeout(() => {
            setSuccess('Usuário cadastrado com sucesso! (Simulação)');
            setFormData({
                nome: '', email: '', login: '', password: '', confirmPassword: '', perfil: 'USER'
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Novos Usuários</h2>
                
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}
                {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField label="Nome Completo" id="nome">
                        <Input type="text" id="nome" value={formData.nome} onChange={handleChange} maxLength={100} required />
                    </FormField>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Email" id="email">
                            <Input type="email" id="email" value={formData.email} onChange={handleChange} maxLength={100} required />
                        </FormField>
                        <FormField label="Login (Nome de Usuário)" id="login">
                            <Input type="text" id="login" value={formData.login} onChange={handleChange} maxLength={50} required />
                        </FormField>
                    </div>

                    <FormField label="Perfil de Acesso" id="perfil">
                        <Select id="perfil" value={formData.perfil} onChange={handleChange}>
                            <option value="USER">Usuário Comum</option>
                            <option value="ADMIN">Administrador</option>
                        </Select>
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Senha" id="password">
                            <Input type="password" id="password" value={formData.password} onChange={handleChange} required minLength={6} />
                        </FormField>
                        <FormField label="Confirmar Senha" id="confirmPassword">
                            <Input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />
                        </FormField>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CadastroUsuarios;
