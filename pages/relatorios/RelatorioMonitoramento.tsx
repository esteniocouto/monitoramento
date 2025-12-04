
import React, { useState, useMemo } from 'react';
import { PencilIcon } from '../../components/icons/IconComponents';
import { mockData, Monitoramento, Status, NivelRisco, RumorEventoData, statusList } from '../../data/mockData';

interface RelatorioMonitoramentoProps {
    onEdit: (id: string) => void;
}

const riscoStyles: Record<string, string> = {
    'Muito Baixo': 'bg-green-700 text-white',
    'Baixo': 'bg-green-200 text-green-800',
    'Moderado': 'bg-yellow-400 text-yellow-900',
    'Alto': 'bg-orange-500 text-white',
    'Muito Alto': 'bg-red-600 text-white',
};

const RelatorioMonitoramento: React.FC<RelatorioMonitoramentoProps> = ({ onEdit }) => {
    // Use mockData directly
    const [data] = useState<Monitoramento[]>(mockData);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'todos'>('todos');
    const [riskFilter, setRiskFilter] = useState<NivelRisco | 'todos'>('todos');

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = searchTerm === '' ||
                (item.titulo && item.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.id && item.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.idu && item.idu.includes(searchTerm));
            
            const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;

            // Verificar se o item é um Rumor/Evento para ter nível de risco
            const itemRisk = (item as RumorEventoData).nivelRisco;
            const matchesRisk = riskFilter === 'todos' || itemRisk === riskFilter;

            return matchesSearch && matchesStatus && matchesRisk;
        });
    }, [searchTerm, statusFilter, riskFilter, data]);

    const statusOptions: (Status | 'todos')[] = ['todos', ...statusList.map(s => s.nome)];
    const riskOptions: (NivelRisco | 'todos')[] = ['todos', 'Muito Baixo', 'Baixo', 'Moderado', 'Alto', 'Muito Alto'];

    // Helper to get status color from dynamic list
    const getStatusStyle = (statusName: string) => {
        const statusItem = statusList.find(s => s.nome === statusName);
        if (statusItem) {
            // Check if color is hex or tailwind class. If hex, return inline style object.
            return { backgroundColor: statusItem.cor, color: '#fff' }; // Defaulting text to white for contrast on custom colors
        }
        return { backgroundColor: '#F3F4F6', color: '#374151' }; // gray-100 / gray-700
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Relatório Geral de Monitoramentos (Dados Simulados)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-1">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">Buscar por ID, IDU ou Título</label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Pesquisar..."
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        id="status-filter"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as Status | 'todos')}
                    >
                        {statusOptions.map(option => (
                            <option key={option} value={option}>{option === 'todos' ? 'Todos' : option}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="risk-filter" className="block text-sm font-medium text-gray-700">Nível de Risco</label>
                    <select
                        id="risk-filter"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value as NivelRisco | 'todos')}
                    >
                        {riskOptions.map(option => (
                            <option key={option} value={option}>{option === 'todos' ? 'Todos' : option}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IDU</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Início</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível de Risco</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((item) => {
                             const itemRisk = (item as RumorEventoData).nivelRisco;
                             const statusStyle = getStatusStyle(item.status);

                             return (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{item.idu}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate" title={item.titulo}>{item.titulo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dataInicio}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span 
                                            className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm"
                                            style={statusStyle}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                       {itemRisk ? (
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${riscoStyles[itemRisk] || 'bg-gray-100'}`}>
                                                {itemRisk}
                                            </span>
                                       ) : (
                                           <span className="text-xs text-gray-400 italic">N/A</span>
                                       )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => onEdit(item.id)}
                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                            title={`Editar ${item.id}`}
                                        >
                                            <PencilIcon />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {filteredData.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum monitoramento encontrado.</p>
                </div>
            )}
        </div>
    );
};

export default RelatorioMonitoramento;
