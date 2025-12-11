
import React, { useState, useEffect } from 'react';
import { Natureza, naturezas as mockNaturezas } from '../../data/mockData';
import { Input, FormField } from '../../components/forms/FormControls';
import { PencilIcon, TrashIcon } from '../../components/icons/IconComponents';

const CadastroNatureza: React.FC = () => {
    const [naturezas, setNaturezas] = useState<Natureza[]>(mockNaturezas);
    const [descricao, setDescricao] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleEdit = (natureza: Natureza) => {
        setEditingId(natureza.id);
        setDescricao(natureza.descricao);
        setError('');
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta natureza?')) {
            setNaturezas(naturezas.filter(n => n.id !== id));
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setDescricao('');
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!descricao.trim()) {
            setError('A descrição é obrigatória.');
            return;
        }
        setError('');

        if (editingId !== null) {
            setNaturezas(naturezas.map(n => n.id === editingId ? { ...n, descricao } : n));
        } else {
            const newNat: Natureza = {
                id: Date.now(),
                descricao
            };
            setNaturezas([...naturezas, newNat]);
        }
        handleCancelEdit();
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    {editingId ? 'Editar Natureza' : 'Cadastrar Nova Natureza'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField label="Descrição" id="descricao">
                        <Input
                            type="text"
                            id="descricao"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Ex: Doenças Transmitidas por Vetores"
                        />
                    </FormField>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-3">
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
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Naturezas Cadastradas</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {naturezas.map((natureza) => (
                                <tr key={natureza.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{natureza.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{natureza.descricao}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-4">
                                        <button onClick={() => handleEdit(natureza)} className="text-blue-600 hover:text-blue-900 transition-colors" title="Editar">
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleDelete(natureza.id)} className="text-red-600 hover:text-red-900 transition-colors" title="Excluir">
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

export default CadastroNatureza;
