import React, { useState } from 'react';
import { representantes as mockRepresentantes, Representante, areas } from '../../data/mockData';
import { Input, Select, FormField } from '../../components/forms/FormControls';

const CadastroRepresentantes: React.FC = () => {
    const [representantes, setRepresentantes] = useState<Representante[]>(mockRepresentantes);
    const [novoRepresentante, setNovoRepresentante] = useState({
        nome: '',
        titularidade: 'Titular' as 'Titular' | 'Vice',
        email: '',
        area_vinculada: '',
    });
    const [error, setError] = useState('');

    const getAreaNome = (areaId: number): string => {
        const area = areas.find(a => a.id === areaId);
        return area ? area.nome : 'Área não encontrada';
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setNovoRepresentante(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!novoRepresentante.nome || !novoRepresentante.email || !novoRepresentante.area_vinculada) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        setError('');
        
        const newEntry: Representante = {
            id: Date.now(), // simple unique id
            nome: novoRepresentante.nome,
            titularidade: novoRepresentante.titularidade,
            email: novoRepresentante.email,
            area_vinculada: Number(novoRepresentante.area_vinculada),
        };

        setRepresentantes(prev => [...prev, newEntry]);
        
        // Reset form
        setNovoRepresentante({
            nome: '',
            titularidade: 'Titular',
            email: '',
            area_vinculada: '',
        });
    };

    return (
        <div className="space-y-8">
            {/* Registration Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Cadastrar Novo Representante</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField label="Nome Completo" id="nome">
                            <Input
                                type="text"
                                id="nome"
                                value={novoRepresentante.nome}
                                onChange={handleChange}
                                placeholder="Nome do representante"
                            />
                        </FormField>
                        <FormField label="Titularidade" id="titularidade">
                            <Select
                                id="titularidade"
                                value={novoRepresentante.titularidade}
                                onChange={handleChange}
                            >
                                <option value="Titular">Titular</option>
                                <option value="Vice">Vice</option>
                            </Select>
                        </FormField>
                        <FormField label="Email" id="email">
                            <Input
                                type="email"
                                id="email"
                                value={novoRepresentante.email}
                                onChange={handleChange}
                                placeholder="email@exemplo.com"
                            />
                        </FormField>
                        <FormField label="Área Vinculada" id="area_vinculada">
                            <Select
                                id="area_vinculada"
                                value={novoRepresentante.area_vinculada}
                                onChange={handleChange}
                            >
                                <option value="">Selecione uma área...</option>
                                {areas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.nome}
                                    </option>
                                ))}
                            </Select>
                        </FormField>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>

            {/* Representatives Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Representantes Cadastrados</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titularidade</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área Vinculada</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {representantes.map((rep) => (
                                <tr key={rep.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rep.nome}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rep.titularidade}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rep.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getAreaNome(rep.area_vinculada)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {representantes.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Nenhum representante cadastrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CadastroRepresentantes;
