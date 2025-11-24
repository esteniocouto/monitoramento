
import React, { useState, useEffect } from 'react';
import { ComunicacaoRiscoData } from '../../data/mockData';
import { Input, Textarea, FormField } from './FormControls';

interface FormProps {
    onBack: () => void;
    onSave: () => void;
    editingId?: string | number | null;
}

interface ComunicacaoRiscoFormProps extends FormProps {
    initialData: ComunicacaoRiscoData | null;
}

const ComunicacaoRiscoForm: React.FC<ComunicacaoRiscoFormProps> = ({ onBack, onSave, editingId, initialData }) => {
    const [formData, setFormData] = useState({
        dataEmail: '', acaoAdotada: '', cnpj: '', categoria: '', escopo: '',
        produto: '', lote: '', nomeEmpresa: '', resolucao: '', url: '',
        dataDou: '', motivoAcao: '', emailNotificador: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                dataEmail: initialData.dataEmail,
                acaoAdotada: initialData.acaoAdotada,
                cnpj: initialData.cnpj,
                categoria: initialData.categoria,
                escopo: initialData.escopo,
                produto: initialData.produto,
                lote: initialData.lote,
                nomeEmpresa: initialData.nomeEmpresa,
                resolucao: initialData.resolucao,
                url: initialData.url,
                dataDou: initialData.dataDou,
                motivoAcao: initialData.motivoAcao,
                emailNotificador: initialData.emailNotificador
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave();
    };

    return (
        <form className="space-y-6 w-full max-w-4xl" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingId ? `Editando Comunicação de Risco: ${editingId}` : 'Nova Comunicação de Risco'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField label="Data do Email" id="dataEmail"><Input type="date" id="dataEmail" value={formData.dataEmail} onChange={handleChange} /></FormField>
                <FormField label="CNPJ" id="cnpj"><Input type="text" id="cnpj" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={handleChange} maxLength={20} /></FormField>
                <FormField label="Nome da Empresa Fiscalizada" id="nomeEmpresa"><Input type="text" id="nomeEmpresa" value={formData.nomeEmpresa} onChange={handleChange} maxLength={100} /></FormField>
                <FormField label="Categoria" id="categoria"><Input type="text" id="categoria" value={formData.categoria} onChange={handleChange} maxLength={100} /></FormField>
                <FormField label="Escopo" id="escopo"><Input type="text" id="escopo" value={formData.escopo} onChange={handleChange} maxLength={100} /></FormField>
                <FormField label="Produto" id="produto"><Input type="text" id="produto" value={formData.produto} onChange={handleChange} maxLength={100} /></FormField>
                <FormField label="Lote" id="lote"><Input type="text" id="lote" value={formData.lote} onChange={handleChange} maxLength={50} /></FormField>
                <FormField label="Resolução" id="resolucao"><Input type="text" id="resolucao" value={formData.resolucao} onChange={handleChange} maxLength={100} /></FormField>
                <FormField label="Data (DOU)" id="dataDou"><Input type="date" id="dataDou" value={formData.dataDou} onChange={handleChange} /></FormField>
                <FormField label="URL" id="url"><Input type="url" id="url" placeholder="https://..." value={formData.url} onChange={handleChange} maxLength={255} /></FormField>
                <FormField label="Email do Notificador (CEAVS)" id="emailNotificador"><Input type="email" id="emailNotificador" value={formData.emailNotificador} onChange={handleChange} maxLength={100} /></FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Ação Adotada" id="acaoAdotada"><Textarea id="acaoAdotada" placeholder="Descreva a ação..." value={formData.acaoAdotada} onChange={handleChange} maxLength={100} /></FormField>
                <FormField label="Motivo da Ação" id="motivoAcao"><Textarea id="motivoAcao" placeholder="Descreva o motivo..." value={formData.motivoAcao} onChange={handleChange} maxLength={255} /></FormField>
            </div>
            <div className="flex justify-end pt-4 gap-3">
                <button type="button" onClick={onBack} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Voltar</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Salvar</button>
            </div>
        </form>
    );
}

export default ComunicacaoRiscoForm;
