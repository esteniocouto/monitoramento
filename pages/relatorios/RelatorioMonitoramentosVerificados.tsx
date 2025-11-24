
import React from 'react';

interface Verificado {
    id: string;
    titulo: string;
    dataVerificacao: string;
    verificadoPor: string;
    observacaoVerificacao: string;
}

// Mock data for demonstration purposes
export const mockData: Verificado[] = [
    { 
        id: 'RUM-015', 
        titulo: 'Suspeita de contaminação em evento gastronômico', 
        dataVerificacao: '2024-07-28', 
        verificadoPor: 'Ana Silva',
        observacaoVerificacao: 'Confirmado com a secretaria de saúde municipal via telefone.'
    },
    { 
        id: 'RUM-018', 
        titulo: 'Aumento de casos de virose na região metropolitana', 
        dataVerificacao: '2024-07-27', 
        verificadoPor: 'Carlos Pereira',
        observacaoVerificacao: 'Dados cruzados com o sistema de notificação compulsória.'
    },
    { 
        id: 'RUM-021', 
        titulo: 'Boato sobre fechamento de hospital regional', 
        dataVerificacao: '2024-07-27', 
        verificadoPor: 'Ana Silva',
        observacaoVerificacao: 'Contato realizado com a diretoria do hospital, que negou o rumor.'
    },
    { 
        id: 'RUM-022', 
        titulo: 'Alerta de produto impróprio para consumo em supermercado', 
        dataVerificacao: '2024-07-26', 
        verificadoPor: 'Mariana Costa',
        observacaoVerificacao: 'Laudo laboratorial recebido e anexado ao processo.'
    },
    { 
        id: 'COM-007', 
        titulo: 'Resolução ANVISA sobre novo medicamento', 
        dataVerificacao: '2024-07-25', 
        verificadoPor: 'Carlos Pereira',
        observacaoVerificacao: 'Verificação documental da publicação no Diário Oficial.'
    },
];

const RelatorioMonitoramentosVerificados: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Monitoramentos Verificados</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título do Monitoramento</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data da Verificação</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verificado Por</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observação</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.titulo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dataVerificacao}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.verificadoPor}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={item.observacaoVerificacao}>{item.observacaoVerificacao}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {mockData.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum monitoramento verificado encontrado.</p>
                </div>
            )}
        </div>
    );
};

export default RelatorioMonitoramentosVerificados;
