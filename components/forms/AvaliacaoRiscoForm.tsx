
import React, { useState, useEffect } from 'react';
import { Input, Textarea, Select, FormField } from './FormControls';

interface AvaliacaoRiscoFormProps { 
    rumorId: number; 
    onBack: () => void; 
    onSave: () => void 
}

const AvaliacaoRiscoForm: React.FC<AvaliacaoRiscoFormProps> = ({ rumorId, onBack, onSave }) => {
    const [formData, setFormData] = useState({
        gravidade: 0, frequencia: 0, vulnerabilidade: 0, probabilidade: 0, capacidade_enfrentamento: 0,
    });
    const [impacto, setImpacto] = useState({ valor: 0, classe: 'Insignificante' });
    const [matrizRisco, setMatrizRisco] = useState({ valor: 0, classe: 'Muito Baixo' });

    const getClassificacaoImpacto = (valor: number): string => {
        if (valor <= 1.66) return 'Insignificante'; if (valor <= 2.33) return 'Baixo';
        if (valor <= 3.66) return 'Médio'; if (valor <= 4.33) return 'Alto';
        return 'Crítico';
    };
    const getClassificacaoMatriz = (valor: number): string => {
        if (valor <= 2) return 'Muito Baixo'; if (valor <= 4) return 'Baixo';
        if (valor <= 6) return 'Moderado'; if (valor <= 8) return 'Alto';
        return 'Muito Alto';
    };

    useEffect(() => {
        const { gravidade, vulnerabilidade, capacidade_enfrentamento, probabilidade } = formData;
        if(gravidade > 0 && vulnerabilidade > 0 && capacidade_enfrentamento > 0 && probabilidade > 0) {
            // Alterado para Soma conforme solicitação anterior do usuário
            const impValor = (gravidade + vulnerabilidade + capacidade_enfrentamento) / 3;
            setImpacto({ valor: impValor, classe: getClassificacaoImpacto(impValor) });
            // Correção do cálculo da matriz (soma, não média, conforme pedido anterior)
            const matrizValor = impValor + probabilidade;
            setMatrizRisco({ valor: matrizValor, classe: getClassificacaoMatriz(matrizValor) });
        }
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave();
    };

    return (
        <form className="space-y-6 w-full max-w-4xl" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-800">Avaliação de Risco</h2>
            <p className="text-gray-600 mb-2">Vinculado ao Rumor/Evento ID: <span className="font-bold">{rumorId}</span></p>

            {/* Aviso sobre Metodologia STAR */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <p className="text-sm text-blue-800">
                    Em caso de dúvida do preenchimento da avaliação de Risco consulte a documentação da metodologia STAR através do link abaixo:
                </p>
                <a 
                    href="https://anvisabr.sharepoint.com/sites/RepositriodeDocumentosdaQualidadedaANVISA/Documentos%20Partilhados/Forms/AllItems.aspx?CT=1764089080223&OR=OWA%2DNT%2DMail&CID=c1d1fce7%2Dbcda%2Ddea4%2D1434%2Dce1faa35a657&ga=1&id=%2Fsites%2FRepositriodeDocumentosdaQualidadedaANVISA%2FDocumentos%20Partilhados%2FVigentes%20Anvisa%2FPOPs%2F0181%20POP%2DF%2DANVISA%2D181%2FFORM%2D965%2E%20POP%2DF%2DANVISA%20181%20V%2E00%20SEI%5F25351%2E813503%5F2024%5F74%2Epdf&viewid=060f8574%2Dae9c%2D468c%2Da107%2Dc148987822ca&parent=%2Fsites%2FRepositriodeDocumentosdaQualidadedaANVISA%2FDocumentos%20Partilhados%2FVigentes%20Anvisa%2FPOPs%2F0181%20POP%2DF%2DANVISA%2D181"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold underline text-sm mt-1 inline-block"
                >
                    Metodologia Star
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField label="Gravidade" id="gravidade"><Select name="gravidade" id="gravidade" onChange={handleChange}><option value="0">Selecione...</option><option value="5">5 - Muito Alto</option><option value="4">4 - Alto</option><option value="3">3 - Moderado</option><option value="2">2 - Baixo</option><option value="1">1 - Muito Baixo</option></Select></FormField>
                <FormField label="Vulnerabilidade" id="vulnerabilidade"><Select name="vulnerabilidade" id="vulnerabilidade" onChange={handleChange}><option value="0">Selecione...</option><option value="5">5 - Muito Alto</option><option value="4">4 - Alto</option><option value="3">3 - Moderado</option><option value="2">2 - Baixo</option><option value="1">1 - Muito Baixo</option></Select></FormField>
                <FormField label="Capacidade de Enfrentamento" id="capacidade_enfrentamento"><Select name="capacidade_enfrentamento" id="capacidade_enfrentamento" onChange={handleChange}><option value="0">Selecione...</option><option value="1">1 - Muito Grande</option><option value="2">2 - Grande</option><option value="3">3 - Moderada</option><option value="4">4 - Pouca</option><option value="5">5 - Muito Pouca</option></Select></FormField>
                <FormField label="Frequência" id="frequencia"><Select name="frequencia" id="frequencia" onChange={handleChange}><option value="0">Selecione...</option><option value="1">1 - Perenes</option><option value="2">2 - Recorrentes</option><option value="3">3 - Frequentes</option><option value="4">4 - Raros</option><option value="5">5 - Aleatórios</option></Select></FormField>
                <FormField label="Probabilidade" id="probabilidade"><Select name="probabilidade" id="probabilidade" onChange={handleChange}><option value="0">Selecione...</option><option value="5">5 - Quase Certo</option><option value="4">4 - Muito Provável</option><option value="3">3 - Provável</option><option value="2">2 - Improvável</option><option value="1">1 - Muito Improvável</option></Select></FormField>
                <FormField label="Nível de Confiança" id="nivel_confianca"><Select id="nivel_confianca"><option value="">Selecione...</option><option value="1">Boa</option><option value="2">Satisfatório</option><option value="3">Insatisfatório</option></Select></FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <FormField label="Impacto (Cálculo Automático)" id="impacto"><Input type="text" id="impacto" value={`${impacto.valor.toFixed(2)} - ${impacto.classe}`} disabled /></FormField>
                <FormField label="Matriz de Risco (Cálculo Automático)" id="matriz_risco"><Input type="text" id="matriz_risco" value={`${matrizRisco.valor.toFixed(2)} - ${matrizRisco.classe}`} disabled /></FormField>
            </div>
            
            <FormField label="Risco à Saúde" id="risco_saude"><Textarea id="risco_saude" placeholder="Descrever consequências..." maxLength={255} /></FormField>
            <FormField label="Recomendação" id="recomendacao"><Textarea id="recomendacao" placeholder="Recomendar ações..." maxLength={255} /></FormField>
            <FormField label="Pautar para CMA?" id="cma"><Select id="cma"><option value="nao">Não</option><option value="sim">Sim</option></Select></FormField>

            <div className="flex justify-end pt-4 gap-3">
                <button type="button" onClick={onBack} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Voltar</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Salvar Avaliação</button>
            </div>
        </form>
    );
};

export default AvaliacaoRiscoForm;
