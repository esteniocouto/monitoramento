
import React, { useState, useEffect } from 'react';
import { mockData, Monitoramento, ComunicacaoRiscoData, RumorEventoData } from '../../data/mockData';
import ComunicacaoRiscoForm from '../../components/forms/ComunicacaoRiscoForm';
import RumorEventoForm from '../../components/forms/RumorEventoForm';
import AvaliacaoRiscoForm from '../../components/forms/AvaliacaoRiscoForm';
import { PageKey } from '../../types';

// --- Main Component with View Logic ---
interface CadastroMonitoramentoProps {
    editingId?: string | number | null;
    onCancelEdit: () => void;
    onNavigate?: (page: PageKey, id?: string | number) => void;
}
const CadastroMonitoramento: React.FC<CadastroMonitoramentoProps> = ({ editingId, onCancelEdit, onNavigate }) => {
    const [view, setView] = useState<'selection' | 'comunicacao_risco' | 'rumor_evento' | 'avaliacao_risco'>('selection');
    const [currentRumorId, setCurrentRumorId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Monitoramento | null>(null);

    useEffect(() => {
        if (editingId) {
            const data = mockData.find(item => item.id === editingId);
            if (data) {
                setEditingData(data);
                if (data.tipo === 'COM') {
                    setView('comunicacao_risco');
                } else {
                    setView('rumor_evento');
                }
            } else {
                console.warn(`Data for editing ID ${editingId} not found.`);
                onCancelEdit(); // Go back if data not found
            }
        } else {
            setEditingData(null);
            setView('selection');
        }
    }, [editingId, onCancelEdit]);


    const handleSaveRumor = (id: number) => {
        setCurrentRumorId(id);
        setView('avaliacao_risco');
    };
    
    const handleBack = () => {
        if(editingId) {
            onCancelEdit();
        } else {
             setView('selection');
        }
    };

    const handleSaveAndExit = () => {
        alert("Salvo com sucesso!");
        
        // Se a função de navegação existir, redireciona para o relatório detalhado
        if (onNavigate && currentRumorId) {
            onNavigate('relatorio-risco-detalhado', currentRumorId);
            return;
        }

        if (editingId) {
            onCancelEdit();
        } else {
            setView('selection');
        }
    }

    const SelectionCard: React.FC<{ title: string; description: string; onClick: () => void }> = ({ title, description, onClick }) => (
        <button
            onClick={onClick}
            className="w-full md:w-80 p-8 border border-gray-200 rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all text-left"
        >
            <h3 className="text-xl font-bold text-blue-700">{title}</h3>
            <p className="mt-2 text-gray-600">{description}</p>
        </button>
    );

    const renderContent = () => {
        switch (view) {
            case 'comunicacao_risco':
                return <ComunicacaoRiscoForm onBack={handleBack} onSave={handleSaveAndExit} editingId={editingId} initialData={editingData as ComunicacaoRiscoData | null}/>;
            case 'rumor_evento':
                return <RumorEventoForm onBack={handleBack} onSave={handleSaveRumor} editingId={editingId} initialData={editingData as RumorEventoData | null} />;
            case 'avaliacao_risco':
                return <AvaliacaoRiscoForm rumorId={currentRumorId!} onBack={() => setView('rumor_evento')} onSave={handleSaveAndExit} />;
            case 'selection':
                 if (editingId) {
                    return <div className="text-center"><p className="text-gray-600">Carregando dados para edição...</p></div>;
                }
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Novo Monitoramento</h2>
                        <p className="text-gray-600 mb-8">Selecione o tipo de monitoramento que você deseja cadastrar.</p>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                            <SelectionCard
                                title="Comunicação de Risco"
                                description="Para registrar notificações oficiais, alertas sanitários, resoluções e ações fiscais."
                                onClick={() => setView('comunicacao_risco')}
                            />
                            <SelectionCard
                                title="Rumor / Evento"
                                description="Para registrar eventos de saúde pública, suspeitas, boatos ou informações não oficiais."
                                onClick={() => setView('rumor_evento')}
                            />
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full flex items-start justify-center">
            {renderContent()}
        </div>
    );
};

export default CadastroMonitoramento;
