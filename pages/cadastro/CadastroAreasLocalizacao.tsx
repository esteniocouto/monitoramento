

import React, { useState } from 'react';
import { areas as mockAreas, Area, naturezas } from '../../data/mockData';
import { Input, FormField, Textarea } from '../../components/forms/FormControls';
import { PencilIcon, TrashIcon } from '../../components/icons/IconComponents';

const CadastroAreasLocalizacao: React.FC = () => {
    const [areas, setAreas] = useState<Area[]>(mockAreas);
    const [form, setForm] = useState({ sigla: '', nome: '', descricao: '' });
    const [selectedNaturezas, setSelectedNaturezas] = useState<number[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleEdit = (area: Area) => {
        setEditingId(area.id);
        setForm({ sigla: area.sigla, nome: area.nome, descricao: area.descricao });
        setSelectedNaturezas(area.naturezaIds || []);
        setError('');
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta área?')) {
            setAreas(areas.filter(a => a.id !== id));
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ sigla: '', nome: '', descricao: '' });
        setSelectedNaturezas([]);
        setError('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setForm(prev => ({ ...prev, [id]: value }));
    }

    const toggleNatureza = (id: number) => {
        setSelectedNaturezas(prev => 
            prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.sigla || !form.nome) {
            setError('Sigla e Nome são obrigatórios.');
            return;
        }
        setError('');

        if (editingId !== null) {
            setAreas(areas.map(a => a.id === editingId ? { ...a, ...form, naturezaIds: selectedNaturezas } : a));
        } else {
            const newArea: Area = {
                id: Date.now(),
                ...form,
                naturezaIds: selectedNaturezas
            };
            setAreas([...areas, newArea]);
        }

        handleCancelEdit();
    };

    const getNaturezaNames = (ids: number[]) => {
        if (!ids || ids.length === 0) return 'Nenhuma';
        return ids.map(id => {
            const nat = naturezas.find(n => n.id === id);
            return nat ? nat.descricao : '';
        }).filter(Boolean).join(', ');
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    {editingId ? 'Editar Área' : 'Cadastrar Nova Área'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Sigla" id="sigla">
                            <Input
                                type="text"
                                id="sigla"
                                value={form.sigla}
                                onChange={handleChange}
                                placeholder="Ex: VISA"
                            />
                        </FormField>
                        <FormField label="Nome" id="nome">
                            <Input
                                type="text"
                                id="nome"
                                value={form.nome}
                                onChange={handleChange}
                                placeholder="Ex: Vigilância Sanitária"
                            />
                        </FormField>
                    </div>
                    <FormField label="Descrição" id="descricao">
                        <Textarea
                            id="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            placeholder="Descrição da área..."
                        />
                    </FormField>
                    
                    {/* Seção de Vinculação de Naturezas */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vincular Naturezas</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-md border border-gray-200 max-h-48 overflow-y-auto">
                            {naturezas.map((nat) => (
                                <label key={nat.id} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
                                    <input
                                        type="checkbox"
                                        checked={selectedNaturezas.includes(nat.id)}
                                        onChange={() => toggleNatureza(nat.id)}
                                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                                    />
                                    <span className="text-sm text-gray-700">{nat.descricao}</span>
                                </label>
                            ))}
                            {naturezas.length === 0 && <span className="text-sm text-gray-500">Nenhuma natureza cadastrada.</span>}
                        </div>
                    </div>

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
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Áreas Cadastradas</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sigla</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naturezas Vinculadas</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {areas.map((area) => (
                                <tr key={area.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{area.sigla}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{area.nome}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{area.descricao}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {getNaturezaNames(area.naturezaIds)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-4">
                                        <button onClick={() => handleEdit(area)} className="text-blue-600 hover:text-blue-900 transition-colors" title="Editar">
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleDelete(area.id)} className="text-red-600 hover:text-red-900 transition-colors" title="Excluir">
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

export default CadastroAreasLocalizacao;
