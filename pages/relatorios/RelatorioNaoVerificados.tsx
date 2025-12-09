
import React, { useMemo } from 'react';
import { mockData, RumorEventoData } from '../../data/mockData';
import { ShieldCheckIcon, ClockIcon } from '../../components/icons/IconComponents';

interface RelatorioNaoVerificadosProps {
    onVerify: (id: string) => void;
}

const RelatorioNaoVerificados: React.FC<RelatorioNaoVerificadosProps> = ({ onVerify }) => {
    
    // Filtrar apenas Rumores/Eventos que NÃO possuem dupla verificação
    const unverifiedData = useMemo(() => {
        return mockData.filter(item => {
            // Ignora Comunicações de Risco (tipo COM)
            if (item.tipo === 'COM') return false;
            
            const rumor = item as RumorEventoData;
            // Retorna verdadeiro se duplaVerificacao for false ou undefined
            return !rumor.duplaVerificacao;
        });
    }, []);

    // Helper to calculate days difference
    const calculateDaysElapsed = (dateString: string) => {
        if (!dateString) return 0;
        const startDate = new Date(dateString);
        const today = new Date();
        
        // Reset time part for accurate day calculation
        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    };

    const getDaysBadgeColor = (days: number) => {
        if (days <= 3) return 'bg-green-100 text-green-800';
        if (days <= 7) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <ShieldCheckIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-700">Monitoramentos Não Verificados</h3>
                    <p className="text-sm text-gray-500">Lista de pendências aguardando dupla checagem de dados.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IDU</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Recebimento</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Dias Pendente</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {unverifiedData.map((item) => {
                            const daysElapsed = calculateDaysElapsed(item.dataInicio);
                            return (
                                <tr key={item.id} className="hover:bg-yellow-50 transition-colors border-l-4 border-l-transparent hover:border-l-yellow-400">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-700">
                                        {item.idu || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                        {item.titulo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(item.dataInicio).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDaysBadgeColor(daysElapsed)}`}>
                                            <ClockIcon className="w-3 h-3 mr-1" />
                                            {daysElapsed} dias
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => onVerify(item.id)}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                                        >
                                            <ShieldCheckIcon className="w-4 h-4 mr-1.5" />
                                            Realizar Verificação
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {unverifiedData.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg mt-4 border-2 border-dashed border-gray-200">
                    <ShieldCheckIcon className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Tudo certo!</p>
                    <p className="text-gray-500 text-sm">Todos os monitoramentos cadastrados já foram verificados.</p>
                </div>
            )}
        </div>
    );
};

export default RelatorioNaoVerificados;
