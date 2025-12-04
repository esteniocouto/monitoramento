

import React, { useState, useEffect } from 'react';
import { RumorEventoData, naturezas, paises, estados, cidades, icmras, areas, statusList } from '../../data/mockData';
import { Input, Textarea, Select, FormField } from './FormControls';
import { XMarkIcon } from '../icons/IconComponents';

interface FormProps {
    onBack: () => void;
    editingId?: string | number | null;
}

interface RumorEventoFormProps extends FormProps {
    onSave: (id: number) => void;
    initialData: RumorEventoData | null;
}

const RumorEventoForm: React.FC<RumorEventoFormProps> = ({ onBack, onSave, editingId, initialData }) => {
    
    // Using Mock Data directly
    const naturezasList = naturezas;
    const icmrasList = icmras;
    const paisesList = paises;
    const [estadosList, setEstadosList] = useState<{id: number, nome: string}[]>([]);
    const [cidadesList, setCidadesList] = useState<{id: number, nome: string}[]>([]);
    
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        titulo: '', dataRecebimento: '', veracidade: '', fundamentoVeracidade: '', localEvento: '',
        notificadorFonte: '', idNatureza: '', descricao: '', idPais: '', idEstado: '', idCidade: '', tipoVigilancia: '',
        status: 'Em Monitoramento', idIcmra: '', tipoEncaminhamento: ''
    });
    
    // TAGS Management
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const [verification, setVerification] = useState({
        duplaVerificacao: false,
        observacaoVerificacao: '',
        dataVerificacao: ''
    });

    // Estado para as áreas selecionadas na verificação
    const [selectedVerificationAreas, setSelectedVerificationAreas] = useState<number[]>([]);

    const [updates, setUpdates] = useState<any[]>([]);
    const [newUpdateDate, setNewUpdateDate] = useState('');
    const [newUpdateDescription, setNewUpdateDescription] = useState('');

    // Populate form if editing (Initial Data)
    useEffect(() => {
        if (initialData) {
            setFormData({
                titulo: initialData.titulo,
                dataRecebimento: initialData.dataInicio,
                veracidade: initialData.veracidade,
                fundamentoVeracidade: initialData.fundamentoVeracidade,
                localEvento: initialData.localEvento,
                notificadorFonte: initialData.notificadorFonte,
                idNatureza: String(initialData.idNatureza),
                descricao: initialData.descricao,
                idPais: String(initialData.idPais),
                idEstado: String(initialData.idEstado),
                idCidade: String(initialData.idCidade),
                tipoVigilancia: initialData.tipoVigilancia || '',
                status: initialData.status || 'Em Monitoramento',
                idIcmra: initialData.idIcmra ? String(initialData.idIcmra) : '',
                tipoEncaminhamento: initialData.tipoEncaminhamento || ''
            });
            
            // Load Tags
            if (initialData.tags) {
                setTags(initialData.tags);
            }

            // Trigger cascade load
            if(initialData.idPais) {
                setEstadosList(estados.filter(e => e.idPais === initialData.idPais));
            }
            if(initialData.idEstado) {
                setCidadesList(cidades.filter(c => c.idEstado === initialData.idEstado));
            }
        }
    }, [initialData]);

    // Efeito para sugerir áreas baseadas na Natureza selecionada
    useEffect(() => {
        const natureId = Number(formData.idNatureza);
        if (natureId) {
            // Encontra áreas que possuem essa natureza vinculada
            const relatedAreas = areas
                .filter(a => a.naturezaIds && a.naturezaIds.includes(natureId))
                .map(a => a.id);
            
            // Atualiza a seleção mantendo o que o usuário já selecionou, mas garantindo que as relacionadas estejam lá
            setSelectedVerificationAreas(prev => {
                const combined = new Set([...prev, ...relatedAreas]);
                return Array.from(combined);
            });
        }
    }, [formData.idNatureza]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const countryId = e.target.value;
        handleChange(e); 
        setEstadosList([]);
        setCidadesList([]);
        setFormData(prev => ({...prev, idEstado: '', idCidade: ''}));
        
        if(countryId) {
            const filteredEstados = estados.filter(e => e.idPais === Number(countryId));
            setEstadosList(filteredEstados);
        }
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const stateId = e.target.value;
        handleChange(e); 
        setCidadesList([]);
        setFormData(prev => ({...prev, idCidade: ''}));
        
        if(stateId) {
            const filteredCidades = cidades.filter(c => c.idEstado === Number(stateId));
            setCidadesList(filteredCidades);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    // TAGS Logic
    const handleAddTag = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
        
        e.preventDefault();
        const newTag = tagInput.trim();
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleVerificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        if (type === 'checkbox') {
             const isChecked = (e.target as HTMLInputElement).checked;
             const today = new Date().toISOString().split('T')[0];
             setVerification(prev => ({
                 ...prev,
                 duplaVerificacao: isChecked,
                 dataVerificacao: isChecked ? today : ''
             }));
        } else {
            setVerification(prev => ({ ...prev, [id]: value }));
        }
    }

    const toggleVerificationArea = (areaId: number) => {
        setSelectedVerificationAreas(prev => 
            prev.includes(areaId) 
                ? prev.filter(id => id !== areaId) 
                : [...prev, areaId]
        );
    };

    const handleAddUpdate = () => {
        if (newUpdateDate && newUpdateDescription) {
            setUpdates([...updates, {
                id: Date.now(),
                date: newUpdateDate,
                description: newUpdateDescription,
            }]);
            setNewUpdateDate('');
            setNewUpdateDescription('');
        } else {
            alert('Por favor, preencha a data e a descrição da atualização.');
        }
    };

    const handleSaveVerificationOnly = () => {
        const areasNames = areas.filter(a => selectedVerificationAreas.includes(a.id)).map(a => a.sigla).join(', ');
        alert(`Dados de verificação salvos!\nÁreas envolvidas: ${areasNames || 'Nenhuma'}`);
    };

    const handleSaveUpdatesOnly = () => {
        alert('Histórico de atualizações salvo com sucesso! (Simulação)');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Simulate API Delay
        setTimeout(() => {
            setSaving(false);
            const fakeId = editingId ? Number(editingId) : Date.now();
            console.log('Saved with tags:', tags);
            alert('Rumor/Evento salvo com sucesso! (Simulação de Banco de Dados)');
            onSave(fakeId);
        }, 1000);
    };

    return (
        <form className="space-y-6 w-full max-w-4xl" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingId ? `Editando Rumor/Evento: ${editingId}` : 'Novo Monitoramento de Rumor/Evento'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField label="Tipo de Monitoramento" id="tipo-monitoramento"><Input type="text" id="tipo-monitoramento" value="Rumor/Evento" disabled /></FormField>
                <FormField label="Status" id="status">
                    <Select id="status" value={formData.status} onChange={handleChange}>
                        {statusList.map(status => (
                            <option key={status.id} value={status.nome}>{status.nome}</option>
                        ))}
                    </Select>
                </FormField>
                <FormField label="Tipo de Encaminhamento" id="tipoEncaminhamento">
                    <Select id="tipoEncaminhamento" value={formData.tipoEncaminhamento} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        <option value="Para Conhecimento">Para Conhecimento</option>
                        <option value="Para Providência">Para Providência</option>
                    </Select>
                </FormField>
                <FormField label="Tipo de Vigilância" id="tipoVigilancia">
                    <Select id="tipoVigilancia" value={formData.tipoVigilancia} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        <option>Ativa</option>
                        <option>Passiva</option>
                    </Select>
                </FormField>
                <FormField label="Título" id="titulo"><Input type="text" id="titulo" placeholder="Ex: Surto em evento..." value={formData.titulo} onChange={handleChange} maxLength={255} required /></FormField>
                <FormField label="Data de Recebimento" id="dataRecebimento"><Input type="date" id="dataRecebimento" value={formData.dataRecebimento} onChange={handleChange} required /></FormField>
                <FormField label="Veracidade" id="veracidade">
                    <Select id="veracidade" value={formData.veracidade} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        <option>Confirmado</option>
                        <option>Suspeito</option>
                        <option>Descartado</option>
                        <option>Não se aplica</option>
                    </Select>
                </FormField>
                <FormField label="Local do Evento" id="localEvento">
                    <Select id="localEvento" value={formData.localEvento} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        <option>Urbano</option>
                        <option>Rural</option>
                        <option>Hospitalar</option>
                        <option>Portos/Aeroportos</option>
                    </Select>
                </FormField>
                <FormField label="Notificador/Fonte" id="notificadorFonte"><Input type="text" id="notificadorFonte" value={formData.notificadorFonte} onChange={handleChange} maxLength={100} /></FormField>
                <FormField label="Natureza" id="idNatureza">
                    <Select id="idNatureza" value={formData.idNatureza} onChange={handleChange} required>
                        <option value="">Selecione a natureza...</option>
                        {naturezasList.map(n => <option key={n.id} value={n.id}>{n.descricao}</option>)}
                    </Select>
                </FormField>
                <FormField label="ICMRA" id="idIcmra">
                    <Select id="idIcmra" value={formData.idIcmra} onChange={handleChange}>
                        <option value="">Selecione ICMRA...</option>
                        {icmrasList.map(i => <option key={i.id} value={i.descricao}>{i.descricao}</option>)}
                    </Select>
                </FormField>
                <FormField label="País" id="idPais">
                    <Select id="idPais" value={formData.idPais} onChange={handleCountryChange}>
                        <option value="">Selecione o país...</option>
                        {paisesList.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </Select>
                </FormField>
                <FormField label="Estado" id="idEstado">
                    <Select id="idEstado" value={formData.idEstado} onChange={handleStateChange} disabled={!formData.idPais}>
                        <option value="">Selecione o estado...</option>
                        {estadosList.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                    </Select>
                </FormField>
                <FormField label="Cidade" id="idCidade">
                     <Select id="idCidade" className="flex-grow" value={formData.idCidade} onChange={handleChange} disabled={!formData.idEstado}>
                        <option value="">Selecione a cidade...</option>
                        {cidadesList.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </Select>
                </FormField>
            </div>
            
            {/* TAGS Field */}
            <div className="w-full">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (Palavras-chave)</label>
                <div className="flex gap-2 mb-2">
                    <Input 
                        type="text" 
                        id="tags" 
                        value={tagInput} 
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag} 
                        placeholder="Digite uma tag e pressione Enter" 
                        className="flex-grow"
                    />
                    <button 
                        type="button" 
                        onClick={handleAddTag}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Adicionar
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {tag}
                            <button 
                                type="button" 
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 inline-flex items-center justify-center p-0.5 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-900 focus:outline-none"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </span>
                    ))}
                    {tags.length === 0 && <span className="text-gray-400 text-sm italic">Nenhuma tag adicionada.</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Descrição" id="descricao"><Textarea id="descricao" placeholder="Detalhes sobre o rumor/evento..." value={formData.descricao} onChange={handleChange} maxLength={500} /></FormField>
                <FormField label="Fundamento da Veracidade" id="fundamentoVeracidade"><Textarea id="fundamentoVeracidade" placeholder="Justificativa para a veracidade..." value={formData.fundamentoVeracidade} onChange={handleChange} maxLength={255} /></FormField>
            </div>

            {/* Sections only visible when editing */}
            {editingId && (
                <>
                    {/* Updates Section */}
                    <div className="pt-8 mt-8 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-xl font-bold text-gray-800">Atualizações do Monitoramento</h3>
                             <button 
                                type="button" 
                                onClick={handleSaveUpdatesOnly}
                                className="bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700 transition-colors"
                             >
                                 Salvar Atualizações
                             </button>
                        </div>
                        
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                            {updates.length > 0 ? updates.map(update => (
                                <div key={update.id} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <p className="text-sm font-semibold text-gray-700">{new Date(update.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                                    <p className="mt-1 text-sm text-gray-600">{update.description}</p>
                                </div>
                            )) : <p className="text-gray-500 text-sm">Nenhuma atualização registrada.</p>}
                        </div>
                        <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-white">
                            <h4 className="text-lg font-semibold text-gray-700">Adicionar Nova Atualização</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1"><FormField label="Data" id="update-date"><Input type="date" id="update-date" value={newUpdateDate} onChange={e => setNewUpdateDate(e.target.value)} /></FormField></div>
                                <div className="md:col-span-2"><FormField label="Descrição da Atualização" id="update-description"><Textarea id="update-description" value={newUpdateDescription} onChange={e => setNewUpdateDescription(e.target.value)} placeholder="Descreva o que aconteceu..." rows={3} maxLength={500} /></FormField></div>
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={handleAddUpdate} className="bg-green-600 text-white px-4 py-2 text-sm rounded-md hover:bg-green-700">Adicionar à Lista</button>
                            </div>
                        </div>
                    </div>

                    {/* Verification Section */}
                    <div className="pt-8 mt-8 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-xl font-bold text-gray-800">Verificação de Dados</h3>
                             <button 
                                type="button" 
                                onClick={handleSaveVerificationOnly}
                                className="bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700 transition-colors"
                             >
                                 Salvar Verificação
                             </button>
                        </div>
                        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 space-y-6">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="duplaVerificacao"
                                    checked={verification.duplaVerificacao}
                                    onChange={handleVerificationChange}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="duplaVerificacao" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                    Dupla Verificação Realizada
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Data da Verificação" id="dataVerificacao">
                                    <Input
                                        type="date"
                                        id="dataVerificacao"
                                        value={verification.dataVerificacao}
                                        disabled
                                    />
                                </FormField>
                                <div className="md:col-span-2">
                                    <FormField label="Observação sobre a Verificação" id="observacaoVerificacao">
                                        <Textarea
                                            id="observacaoVerificacao"
                                            value={verification.observacaoVerificacao}
                                            onChange={handleVerificationChange}
                                            placeholder="Insira observações sobre o processo de verificação..."
                                            maxLength={500}
                                        />
                                    </FormField>
                                </div>
                            </div>

                            {/* Seleção de Áreas para Verificação */}
                            <div className="mt-4 pt-4 border-t border-indigo-200">
                                <label className="block text-sm font-bold text-indigo-900 mb-3">Áreas Envolvidas na Verificação</label>
                                <p className="text-xs text-indigo-700 mb-3">
                                    Áreas marcadas com * são sugeridas automaticamente com base na natureza do evento. Você pode adicionar ou remover áreas conforme necessário.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-white p-4 rounded-md border border-indigo-100 max-h-48 overflow-y-auto">
                                    {areas.map((area) => {
                                        const isRelated = area.naturezaIds && area.naturezaIds.includes(Number(formData.idNatureza));
                                        return (
                                            <label key={area.id} className={`flex items-center space-x-2 cursor-pointer p-2 rounded border transition-colors ${selectedVerificationAreas.includes(area.id) ? 'bg-indigo-100 border-indigo-300' : 'hover:bg-gray-50 border-transparent'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedVerificationAreas.includes(area.id)}
                                                    onChange={() => toggleVerificationArea(area.id)}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-800 font-medium">{area.sigla}</span>
                                                    <span className="text-xs text-gray-500">{area.nome} {isRelated && <span className="text-indigo-600 font-bold">*</span>}</span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                    {areas.length === 0 && <span className="text-sm text-gray-500">Nenhuma área cadastrada.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="flex justify-end pt-8 gap-3 border-t border-gray-200">
                <button type="button" onClick={onBack} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Voltar</button>
                <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                    {saving ? 'Salvando...' : (editingId ? 'Salvar Dados Principais' : 'Salvar e Continuar')}
                </button>
            </div>
        </form>
    );
};

export default RumorEventoForm;
