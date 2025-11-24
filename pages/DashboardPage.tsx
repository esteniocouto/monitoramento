import React from 'react';
import {
    MegaphoneIcon,
    ClockIcon,
    CheckBadgeIcon,
    ClipboardDocumentListIcon
} from '../components/icons/IconComponents';
import { mockData as monitoramentoData } from '../data/mockData';
import { mockData as verificadosData } from './relatorios/RelatorioMonitoramentosVerificados';


interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const DashboardPage: React.FC = () => {
    // --- Data Processing ---
    const totalMonitoramentos = monitoramentoData.length;
    const emMonitoramento = monitoramentoData.filter(d => d.status === 'Em Monitoramento').length;
    const pautadosCMA = monitoramentoData.filter(d => d.pautadoCMA).length;

    const verificadosIDs = new Set(verificadosData.map(v => v.id));
    const emAndamentoVerificados = monitoramentoData.filter(d =>
        d.status === 'Em Monitoramento' && verificadosIDs.has(d.id)
    ).length;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Visão Geral</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total de Monitoramentos" value={totalMonitoramentos} icon={ClipboardDocumentListIcon} color="bg-blue-500" />
                    <StatCard title="Monitoramentos em Andamento" value={emMonitoramento} icon={ClockIcon} color="bg-yellow-500" />
                    <StatCard title="Indicados para CMA" value={pautadosCMA} icon={MegaphoneIcon} color="bg-indigo-500" />
                    <StatCard title="Verificados (Em Andamento)" value={emAndamentoVerificados} icon={CheckBadgeIcon} color="bg-purple-500" />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
