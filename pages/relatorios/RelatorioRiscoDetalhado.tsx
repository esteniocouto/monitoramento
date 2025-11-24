
import React, { useState } from 'react';
import { mockData, Monitoramento, RumorEventoData, NivelRisco, naturezas, icmras, areas } from '../../data/mockData';
import { Input } from '../../components/forms/FormControls';

const riskToProbabilityMap: Record<NivelRisco, string> = {
    'Muito Baixo': 'Muito Improvável',
    'Baixo': 'Improvável',
    'Moderado': 'Provável',
    'Alto': 'Muito Provável',
    'Muito Alto': 'Quase Certo',
};

const gravidadeVulnerabilidadeMap: Record<number, string> = {
    1: '1 - Muito Baixo',
    2: '2 - Baixo',
    3: '3 - Moderado',
    4: '4 - Alto',
    5: '5 - Muito Alto',
};

const capacidadeMap: Record<number, string> = {
    1: '1 - Muito Grande',
    2: '2 - Grande',
    3: '3 - Moderada',
    4: '4 - Pouca',
    5: '5 - Muito Pouca',
};

const ReportContent: React.FC<{ data: Monitoramento }> = ({ data }) => {
    const isRumor = data.tipo === 'RUM' || data.tipo === 'EVT';
    const rumorData = isRumor ? (data as RumorEventoData) : null;
    const description = rumorData ? rumorData.descricao : 'Não aplicável para Comunicação de Risco.';

    const getNaturezaDesc = (id?: number) => {
        if (!id) return 'Não informada';
        return naturezas.find(n => n.id === id)?.descricao || 'Desconhecida';
    };

    const getIcmraDesc = (id?: number) => {
        if (!id) return 'Não informado';
        return icmras.find(i => i.id === id)?.descricao || 'Desconhecido';
    };

    const getRelatedAreas = (naturezaId?: number) => {
        if (!naturezaId) return [];
        return areas.filter(a => a.naturezaIds && a.naturezaIds.includes(naturezaId));
    };

    const relatedAreas = rumorData ? getRelatedAreas(rumorData.idNatureza) : [];

    return (
        <div id="report-content" className="bg-white p-8 rounded-lg shadow-lg animate-fade-in">
            <header className="border-b pb-4 mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Relatório de Avaliação Estratégica de Risco</h1>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-2 text-gray-600">
                    <p className="text-lg">Monitoramento IDU: <span className="font-bold text-gray-800 font-mono">{data.idu || 'N/A'}</span></p>
                    <span className="hidden md:inline text-gray-400">|</span>
                    <p className="text-md">Registrado em: <span className="font-semibold text-gray-800">{new Date(data.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span></p>
                </div>
            </header>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-700 border-l-4 border-blue-700 pl-3 mb-3">Objetivo</h2>
                <p className="text-gray-700">
                    Avaliar e priorizar riscos de emergências de saúde pública em contextos nacionais, subnacionais ou locais, com base em evidências e participação multissetorial.
                </p>
            </section>
            
            <section className="mb-6">
                <h2 className="text-xl font-semibold text-blue-700 border-l-4 border-blue-700 pl-3 mb-3">Metodologia STAR</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                    <li>Determinação das ameaças e descrição da situação que pode exigir resposta coordenada.</li>
                    <li>Avaliação da probabilidade de ocorrência da ameaça.</li>
                    <li>Estimativa do impacto, considerando: Gravidade, Vulnerabilidade, Capacidade de afrontamento.</li>
                    <li>Classificação do risco com base em matriz 5x5 (probabilidade × impacto).</li>
                    <li>Formulação de recomendações e medidas prioritárias.</li>
                    <li>Integração das recomendações em planos nacionais/subnacionais.</li>
                </ol>
            </section>

            <section className="border-t pt-6">
                 <h2 className="text-xl font-semibold text-blue-700 border-l-4 border-blue-700 pl-3 mb-4">Análise do Risco Específico</h2>
                 <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                        <strong className="text-gray-800 block mb-2">1. Ameaça e Descrição da Situação:</strong>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mb-3">
                             <p className="text-gray-700"><strong>Título:</strong> {data.titulo}</p>
                             <p className="text-gray-700"><strong>Natureza:</strong> {rumorData ? getNaturezaDesc(rumorData.idNatureza) : 'N/A'}</p>
                             <p className="text-gray-700"><strong>ICMRA:</strong> {rumorData ? getIcmraDesc(rumorData.idIcmra) : 'N/A'}</p>
                             <p className="text-gray-700"><strong>Local:</strong> {rumorData?.localEvento || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border border-gray-100">
                            <p className="text-gray-700 text-sm font-semibold mb-1">Descrição:</p>
                            <p className="text-gray-600">{description}</p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p className="text-gray-700 text-sm"><strong className="text-gray-900">Data de Recebimento:</strong> {data.dataInicio}</p>
                            {isRumor && (
                                <>
                                    <p className="text-gray-700 text-sm"><strong className="text-gray-900">Cadastrado por:</strong> {rumorData?.usuarioCadastro || 'Não informado'}</p>
                                    <p className="text-gray-700 text-sm"><strong className="text-gray-900">Verificado por:</strong> {rumorData?.usuarioVerificacao || 'Não verificado'}</p>
                                </>
                            )}
                        </div>
                    </div>
                     <div className="p-4 border rounded-md">
                        <strong className="text-gray-800 block">2. Avaliação da Probabilidade:</strong>
                        <p className="text-gray-700 mt-1">{rumorData ? riskToProbabilityMap[rumorData.nivelRisco] : 'Não aplicável'}</p>
                    </div>
                     <div className="p-4 border rounded-md">
                        <strong className="text-gray-800 block">3. Estimativa do Impacto:</strong>
                        <ul className="list-disc list-inside text-gray-700 mt-1">
                            <li><strong>Gravidade:</strong> {rumorData?.gravidade ? gravidadeVulnerabilidadeMap[rumorData.gravidade] : 'Não avaliado'}</li>
                            <li><strong>Vulnerabilidade:</strong> {rumorData?.vulnerabilidade ? gravidadeVulnerabilidadeMap[rumorData.vulnerabilidade] : 'Não avaliado'}</li>
                            <li><strong>Capacidade de Afrontamento:</strong> {rumorData?.capacidade_enfrentamento ? capacidadeMap[rumorData.capacidade_enfrentamento] : 'Não avaliado'}</li>
                        </ul>
                    </div>
                     <div className="p-4 border rounded-md">
                        <strong className="text-gray-800 block">4. Classificação do Risco:</strong>
                        <p className="text-gray-700 mt-1">{isRumor ? (data as RumorEventoData).nivelRisco : 'Não aplicável'}</p>
                    </div>
                     <div className="p-4 border rounded-md">
                        <strong className="text-gray-800 block">5. Recomendações e Medidas Prioritárias:</strong>
                        <p className="text-gray-700 mt-1">Recomendações a serem definidas pela equipe técnica com base na análise completa.</p>
                    </div>
                     <div className="p-4 border rounded-md">
                        <strong className="text-gray-800 block">6. Integração em Planos:</strong>
                        <p className="text-gray-700 mt-1">As medidas prioritárias devem ser integradas aos planos de contingência existentes.</p>
                    </div>
                    
                    <div className="p-4 border rounded-md bg-indigo-50 border-indigo-100">
                        <strong className="text-indigo-900 block mb-2">7. Áreas Relacionadas com o Evento:</strong>
                        <p className="text-xs text-indigo-700 mb-2">Identificadas com base na natureza do evento.</p>
                        {relatedAreas.length > 0 ? (
                            <ul className="list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-2">
                                {relatedAreas.map(area => (
                                    <li key={area.id} className="text-gray-700">
                                        <span className="font-semibold">{area.sigla}</span> - {area.nome}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">Nenhuma área relacionada encontrada.</p>
                        )}
                    </div>
                 </div>
            </section>
        </div>
    );
};

const RelatorioRiscoDetalhado: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [reportData, setReportData] = useState<Monitoramento | null>(null);
    const [error, setError] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const term = searchTerm.trim().toLowerCase();
        if (!term) return;

        const foundData = mockData.find(item => 
            item.id.toLowerCase() === term || 
            (item.idu && item.idu.includes(term))
        );

        if (foundData) {
            setReportData(foundData);
        } else {
            setError('Nenhum monitoramento encontrado com o ID ou IDU fornecido.');
            setReportData(null);
        }
    };
    
    const handlePrint = () => {
        window.print();
    };
    
    const handleBack = () => {
        setReportData(null);
        setSearchTerm('');
        setError('');
    };

    return (
        <>
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #report-content, #report-content * {
                            visibility: visible;
                        }
                        #report-content {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                        .no-print {
                           display: none;
                        }
                    }
                     @keyframes fade-in {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.5s ease-out forwards;
                    }
                `}
            </style>
            <div className="w-full">
                {!reportData ? (
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto text-center no-print">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Gerar Relatório de Risco Detalhado</h3>
                        <p className="text-gray-600 mb-6">Insira o ID ou IDU do monitoramento para visualizar o relatório completo.</p>
                        <form onSubmit={handleSearch} className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="searchTerm" className="sr-only">ID ou IDU</label>
                                <Input
                                    type="text"
                                    id="searchTerm"
                                    placeholder="Ex: RUM-015 ou 20072024..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    required
                                />
                            </div>
                             {error && <p className="text-red-600 text-sm">{error}</p>}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Gerar Relatório
                            </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-end gap-3 mb-6 no-print">
                             <button onClick={handleBack} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
                                Voltar
                            </button>
                            <button onClick={handlePrint} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                                Imprimir Relatório
                            </button>
                        </div>
                        <ReportContent data={reportData} />
                    </div>
                )}
            </div>
        </>
    );
};

export default RelatorioRiscoDetalhado;
