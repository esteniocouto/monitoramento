
import React, { useState, useEffect } from 'react';
// Use data directly from mock
import { 
    RumorEventoData, 
    naturezas as mockNaturezas, 
    statusList,
    icmras as mockIcmras,
    paises as mockPaises,
    estados as mockEstados,
    cidades as mockCidades
} from '../../data/mockData';
import { Input, Textarea, Select, FormField, CreatableSelect } from './FormControls';

interface FormProps {
    onBack: () => void;
    editingId?: string | number | null;
}

interface RumorEventoFormProps extends FormProps {
    onSave: (id: number) => void;
    initialData: RumorEventoData | null;
}

const RumorEventoForm: React.FC<RumorEventoFormProps> = ({ onBack, onSave, editingId, initialData }) => {
    
    // API Data States (Simulated from Mock)
    const [naturezasList, setNaturezasList] = useState<any[]>(mockNaturezas);
    const [icmrasList, setIcmrasList] = useState<any[]>(mockIcmras);
    const [paisesList, setPaisesList] = useState<any[]>(mockPaises);
    
    // Listas filtradas para exibição
    const [filteredEstados, setFilteredEstados] = useState<any[]>([]);
    const [filteredCidades, setFilteredCidades] = useState<any[]>([]);
    
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        titulo: '', dataRecebimento: '', veracidade: '', fundamentoVeracidade: '', localEvento: '',
        notificadorFonte: '', idNatureza: '', descricao: '', idPais: '', idEstado: '', idCidade: '', tipoVigilancia: '',
        status: 'Em Monitoramento', idIcmra: '', tipoEncaminhamento: ''
    });

    // Load Estados when Pais changes (Mock Logic)
    useEffect(() => {
        if (formData.idPais) {
            const filtered = mockEstados.filter(e => String(e.idPais) === String(formData.idPais));
            setFilteredEstados(filtered);
        } else {
            setFilteredEstados([]);
        }
    }, [formData.idPais]);

    // Load Cidades when Estado changes (Mock Logic)
    useEffect(() => {
        if (formData.idEstado) {
            const filtered = mockCidades.filter(c => String(c.idEstado) === String(formData.idEstado));
            setFilteredCidades(filtered);
        } else {
            setFilteredCidades([]);
        }
    }, [formData.idEstado]);

    // Populate form if editing
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
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectPais = (val: string | number) => {
        setFormData(prev => ({ ...prev, idPais: String(val), idEstado: '', idCidade: '' }));
    };
    const handleSelectEstado = (val: string | number) => {
        setFormData(prev => ({ ...prev, idEstado: String(val), idCidade: '' }));
    };
    const handleSelectCidade = (val: string | number) => {
        setFormData(prev => ({ ...prev, idCidade: String(val) }));
    };

    const handleCreatePais = (nome: string) => alert("Criação de país via frontend desabilitada nesta versão.");
    const handleCreateEstado = (nome: string) => alert("Criação de estado via frontend desabilitada nesta versão.");
    const handleCreateCidade = (nome: string) => alert("Criação de cidade via frontend desabilitada nesta versão.");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Simulation
        setTimeout(() => {
            setSaving(false);
            alert('Monitoramento salvo com sucesso! (Modo Demonstração - Dados não persistidos no servidor)');
            // Retorna um ID falso para continuar o fluxo
            onSave(12345);
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
                        {icmrasList.map(i => <option key={i.id} value={i.id}>{i.descricao}</option>)}
                    </Select>
                </FormField>
                
                {/* GEOGRAFIA com CreatableSelect (Modo Seleção) */}
                <FormField label="País" id="idPais">
                    <CreatableSelect
                        id="idPais"
                        value={formData.idPais}
                        options={paisesList}
                        onChange={handleSelectPais}
                        onCreate={handleCreatePais}
                        placeholder="Pesquisar País..."
                    />
                </FormField>
                <FormField label="Estado" id="idEstado">
                    <CreatableSelect
                        id="idEstado"
                        value={formData.idEstado}
                        options={filteredEstados}
                        onChange={handleSelectEstado}
                        onCreate={handleCreateEstado}
                        placeholder="Pesquisar Estado..."
                        disabled={!formData.idPais}
                    />
                </FormField>
                <FormField label="Cidade" id="idCidade">
                    <CreatableSelect
                        id="idCidade"
                        value={formData.idCidade}
                        options={filteredCidades}
                        onChange={handleSelectCidade}
                        onCreate={handleCreateCidade}
                        placeholder="Pesquisar Cidade..."
                        disabled={!formData.idEstado}
                    />
                </FormField>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Descrição" id="descricao"><Textarea id="descricao" placeholder="Detalhes sobre o rumor/evento..." value={formData.descricao} onChange={handleChange} maxLength={500} /></FormField>
                <FormField label="Fundamento da Veracidade" id="fundamentoVeracidade"><Textarea id="fundamentoVeracidade" placeholder="Justificativa para a veracidade..." value={formData.fundamentoVeracidade} onChange={handleChange} maxLength={255} /></FormField>
            </div>

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
