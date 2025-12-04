
import React, { useState, useEffect } from 'react';
import { 
    mockData, Monitoramento, RumorEventoData, NivelRisco, 
    naturezas, icmras, areas,
    paises, estados, cidades 
} from '../../data/mockData';
import { Input } from '../../components/forms/FormControls';

interface RelatorioRiscoDetalhadoProps {
    preSelectedId?: string | number | null;
}

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

    const getGeoLocation = (idPais?: number, idEstado?: number, idCidade?: number) => {
        const pais = paises.find(p => p.id === idPais)?.nome;
        const estado = estados.find(e => e.id === idEstado)?.nome;
        const cidade = cidades.find(c => c.id === idCidade)?.nome;

        const parts = [pais, estado, cidade].filter(Boolean);
        return parts.length > 0 ? parts.join(' / ') : 'Não informada';
    };

    const calculateImpacto = (g?: number, v?: number, c?: number) => {
        if(!g || !v || !c) return 'Não avaliado';
        const val = (g + v + c) / 3;
        let label = '';
        if (val <= 1.66) label = 'Insignificante';
        else if (val <= 2.33) label = 'Baixo';
        else if (val <= 3.66) label = 'Médio';
        else if (val <= 4.33) label = 'Alto';
        else label = 'Crítico';
        return `${val.toFixed(2)} - ${label}`;
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
                <h2 className="text-xl font-semibold text-blue-700 border-l-4 border-blue-700 pl-3 mb-3">Dados do monitoramento</h2>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-gray-700 text-sm">
                    <div className="grid grid-cols-1 gap-2 mb-2">
                        <p><strong className="text-gray-900">Título:</strong> {data.titulo}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p><strong className="text-gray-900">Status Atual:</strong> {data.status}</p>
                        <p><strong className="text-gray-900">Data de Recebimento:</strong> {data.dataInicio}</p>
                        {isRumor && (
                            <>
                                <p><strong className="text-gray-900">Cadastrado por:</strong> {rumorData?.usuarioCadastro || 'Não informado'}</p>
                                <p><strong className="text-gray-900">Verificado por:</strong> {rumorData?.usuarioVerificacao || 'Não verificado'}</p>
                            </>
                        )}
                    </div>
                </div>
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
                             <p className="text-gray-700"><strong>Natureza:</strong> {rumorData ? getNaturezaDesc(rumorData.idNatureza) : 'N/A'}</p>
                             <p className="text-gray-700"><strong>ICMRA:</strong> {rumorData ? getIcmraDesc(rumorData.idIcmra) : 'N/A'}</p>
                             <p className="text-gray-700"><strong>Local:</strong> {rumorData?.localEvento || 'N/A'}</p>
                             <p className="text-gray-700"><strong>Localização Geográfica:</strong> {rumorData ? getGeoLocation(rumorData.idPais, rumorData.idEstado, rumorData.idCidade) : 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border border-gray-100">
                            <p className="text-gray-700 text-sm font-semibold mb-1">Descrição:</p>
                            <p className="text-gray-600">{description}</p>
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
                            <li><strong>Capacidade de Enfrentamento:</strong> {rumorData?.capacidade_enfrentamento ? capacidadeMap[rumorData.capacidade_enfrentamento] : 'Não avaliado'}</li>
                            <li className="mt-1"><strong>Impacto:</strong> {calculateImpacto(rumorData?.gravidade, rumorData?.vulnerabilidade, rumorData?.capacidade_enfrentamento)}</li>
                        </ul>
                    </div>
                     <div className="p-4 border rounded-md">
                        <strong className="text-gray-800 block">4. Classificação do Risco:</strong>
                        <div className="text-gray-700 mt-1 flex flex-col gap-1">
                            <p><strong>Nível de Risco:</strong> {isRumor ? (data as RumorEventoData).nivelRisco : 'Não aplicável'}</p>
                            <p><strong>Nível de Confiança:</strong> {rumorData?.nivelConfianca || 'Não informado'}</p>
                        </div>
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

const RelatorioRiscoDetalhado: React.FC<RelatorioRiscoDetalhadoProps> = ({ preSelectedId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [reportData, setReportData] = useState<Monitoramento | null>(null);
    const [error, setError] = useState('');

    // Auto-search effect if ID is provided via props
    useEffect(() => {
        if (preSelectedId) {
            const idStr = String(preSelectedId);
            setSearchTerm(idStr);
            performSearch(idStr);
        }
    }, [preSelectedId]);

    const performSearch = (term: string) => {
        const cleanTerm = term.trim().toLowerCase();
        if (!cleanTerm) return;

        const foundData = mockData.find(item => 
            item.id.toLowerCase() === cleanTerm || 
            (item.idu && item.idu.includes(cleanTerm)) ||
            String(item.id) === cleanTerm // Case where ID is a number/timestamp from creation
        );

        if (foundData) {
            setReportData(foundData);
            setError('');
        } else {
            setError('Nenhum monitoramento encontrado com o ID ou IDU fornecido.');
            setReportData(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        performSearch(searchTerm);
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
