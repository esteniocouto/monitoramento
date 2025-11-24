import React from 'react';
import { PencilIcon } from '../../components/icons/IconComponents';

type Status = 'Em Monitoramento' | 'Finalizado';

interface CmaItem {
  id: string;
  titulo: string;
  dataInicio: string;
  status: Status;
  dataConclusao?: string;
}

interface RelatorioCMAProps {
    onEdit: (id: string) => void;
}

// Mock data simulating monitorings flagged for CMA
const mockData: CmaItem[] = [
    { id: 'EVT-003', titulo: 'Aumento de casos de virose na região metropolitana', dataInicio: '2024-07-10', status: 'Em Monitoramento' },
    { id: 'RUM-015', titulo: 'Suspeita de contaminação em evento gastronômico', dataInicio: '2024-06-20', status: 'Finalizado', dataConclusao: '2024-07-15' },
    { id: 'RUM-028', titulo: 'Suspeita de surto de dengue em escola municipal', dataInicio: '2024-07-22', status: 'Em Monitoramento' },
    { id: 'RUM-031', titulo: 'Alerta sobre água contaminada em bairro central', dataInicio: '2024-05-11', status: 'Finalizado', dataConclusao: '2024-06-02' },
];

const statusStyles: Record<Status, string> = {
    'Em Monitoramento': 'bg-yellow-100 text-yellow-800',
    'Finalizado': 'bg-green-100 text-green-800',
};

const RelatorioCMA: React.FC<RelatorioCMAProps> = ({ onEdit }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Relatório de Monitoramentos para CMA</h3>
            <p className="text-sm text-gray-500 mb-6">Esta lista contém os Rumores/Eventos que foram marcados para discussão no CMA.</p>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Início</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Conclusão</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-sm">{item.titulo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dataInicio}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[item.status]}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.dataConclusao || '—'}
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
                        ))}
                    </tbody>
                </table>
            </div>
            {mockData.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum monitoramento marcado para CMA encontrado.</p>
                </div>
            )}
        </div>
    );
};

export default RelatorioCMA;