
import React, { useState } from 'react';
import { statusList as mockStatus, StatusItem } from '../../data/mockData';
import { Input, FormField, Textarea } from '../../components/forms/FormControls';
import { PencilIcon, TrashIcon } from '../../components/icons/IconComponents';

const CadastroStatus: React.FC = () => {
    const [statusList, setStatusList] = useState<StatusItem[]>(mockStatus);
    const [form, setForm] = useState({ nome: '', descricao: '', cor: '#3B82F6' });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleEdit = (status: StatusItem) => {
        setEditingId(status.id);
        setForm({ nome: status.nome, descricao: status.descricao, cor: status.cor });
        setError('');
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este status?')) {
            setStatusList(statusList.filter(s => s.id !== id));
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ nome: '', descricao: '', cor: '#3B82F6' });
        setError('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setForm(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nome) {
            setError('O nome do status é obrigatório.');
            return;
        }
        setError('');

        if (editingId !== null) {
            setStatusList(statusList.map(s => s.id === editingId ? { ...s, ...form } : s));
        } else {
            const newStatus: StatusItem = {
                id: Date.now(),
                ...form
            };
            setStatusList([...statusList, newStatus]);
        }

        handleCancelEdit();
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    {editingId ? 'Editar Status' : 'Cadastrar Novo Status'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Nome do Status" id="nome">
                            <Input
                                type="text"
                                id="nome"
                                value={form.nome}
                                onChange={handleChange}
                                placeholder="Ex: Em Análise"
                                maxLength={50}
                            />
                        </FormField>
                        <div className="flex items-end gap-4">
                             <div className="flex-grow">
                                <FormField label="Cor (Identificador Visual)" id="cor">
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="color"
                                            id="cor"
                                            value={form.cor}
                                            onChange={handleChange}
                                            className="h-10 w-20 p-1 rounded border border-gray-300 cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-500 font-mono">{form.cor}</span>
                                    </div>
                                </FormField>
                             </div>
                        </div>
                    </div>
                    <FormField label="Descrição" id="descricao">
                        <Textarea
                            id="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            placeholder="Descreva quando este status deve ser utilizado..."
                            maxLength={150}
                        />
                    </FormField>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <div className="flex justify-end gap-3 pt-2">
                        {editingId && (
                             <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            {editingId ? 'Salvar Alterações' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Status Disponíveis</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {statusList.map((status) => (
                                <tr key={status.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div 
                                            className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" 
                                            style={{ backgroundColor: status.cor }}
                                            title={status.cor}
                                        ></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{status.nome}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{status.descricao}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-4">
                                        <button onClick={() => handleEdit(status)} className="text-blue-600 hover:text-blue-900 transition-colors" title="Editar">
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleDelete(status.id)} className="text-red-600 hover:text-red-900 transition-colors" title="Excluir">
                                            <TrashIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CadastroStatus;
