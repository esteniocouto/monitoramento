
import React, { useState, useEffect } from 'react';
import { RumorEventoData, naturezas, paises, estados, cidades, icmras } from '../../data/mockData';
import { Input, Textarea, Select, FormField } from './FormControls';

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
        status: 'Em Monitoramento', idIcmra: ''
    });
    
    const [verification, setVerification] = useState({
        duplaVerificacao: false,
        observacaoVerificacao: '',
        dataVerificacao: ''
    });

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
                idIcmra: initialData.idIcmra ? String(initialData.idIcmra) : ''
            });

            // Trigger cascade load
            if(initialData.idPais) {
                setEstadosList(estados.filter(e => e.idPais === initialData.idPais));
            }
            if(initialData.idEstado) {
                setCidadesList(cidades.filter(c => c.idEstado === initialData.idEstado));
            }
        }
    }, [initialData]);

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
        alert('Dados de verificação salvos com sucesso! (Simulação)');
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
                        <option value="Em Monitoramento">Em Monitoramento</option>
                        <option value="Finalizado">Finalizado</option>
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
