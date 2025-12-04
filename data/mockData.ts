

export type Status = string; // Alterado para string para permitir valores dinâmicos
export type NivelRisco = 'Muito Baixo' | 'Baixo' | 'Moderado' | 'Alto' | 'Muito Alto';

// Interface base para auditoria
interface Auditoria {
    usuarioCadastroId?: number;
    dataCadastro?: string; // ISO Date
    usuarioAlteracaoId?: number;
    dataAlteracao?: string; // ISO Date
}

interface BaseMonitoramento extends Auditoria {
    id: string;
    idu: string; // Identificador Único (DDMMYYYYHHmmss)
    titulo: string;
    dataInicio: string;
    pautadoCMA: boolean;
    dataConclusao?: string;
    status: Status; // Mantido no frontend para controle de fluxo, mesmo que no banco Comunicação não tenha tabela de Status relacional direta, é útil na UI.
}

export interface ComunicacaoRiscoData extends BaseMonitoramento {
    tipo: 'COM';
    // Comunicação não tem NivelRisco
    dataEmail: string;
    acaoAdotada: string;
    cnpj: string;
    categoria: string;
    escopo: string;
    produto: string;
    lote: string;
    nomeEmpresa: string;
    resolucao: string;
    url: string;
    dataDou: string;
    motivoAcao: string;
    emailNotificador: string;
}

export interface RumorEventoData extends BaseMonitoramento {
    tipo: 'RUM' | 'EVT';
    nivelRisco: NivelRisco; // Apenas Rumor tem risco
    veracidade: 'Confirmado' | 'Suspeito' | 'Descartado' | 'Não se aplica' | '';
    fundamentoVeracidade: string;
    descricao: string;
    localEvento: 'Urbano' | 'Rural' | 'Hospitalar' | 'Portos/Aeroportos' | '';
    notificadorFonte: string;
    idPais: number;
    idEstado: number;
    idCidade: number;
    idNatureza: number;
    idIcmra?: number;
    gravidade?: number;
    vulnerabilidade?: number;
    capacidade_enfrentamento?: number;
    nivelConfianca?: string; // Novo campo
    tipoVigilancia?: 'Ativa' | 'Passiva' | '';
    tipoEncaminhamento?: 'Para Conhecimento' | 'Para Providência' | ''; // Novo campo solicitado
    // Campos de verificação
    duplaVerificacao?: boolean;
    observacaoVerificacao?: string;
    dataVerificacao?: string;
    // User tracking legível para UI (além dos IDs de auditoria)
    usuarioCadastro?: string;
    usuarioVerificacao?: string;
    tags?: string[]; // Normalização: Tags agora são uma lista
}

export type Monitoramento = ComunicacaoRiscoData | RumorEventoData;

export interface Area {
    id: number;
    sigla: string;
    nome: string;
    descricao: string;
    naturezaIds: number[]; // Array de IDs de naturezas vinculadas
}

export interface Representante {
    id: number;
    nome: string;
    titularidade: 'Titular' | 'Vice';
    email: string;
    area_vinculada: number;
}

export interface Natureza {
    id: number;
    descricao: string;
}

export interface Icmra {
    id: number;
    descricao: string;
}

export interface StatusItem {
    id: number;
    nome: string;
    descricao: string;
    cor: string; // Código Hex ou classe Tailwind
}

export interface Pais { id: number; nome: string; }
export interface Estado { id: number; nome: string; idPais: number; }
export interface Cidade { id: number; nome: string; idEstado: number; }

// Lista Dinâmica de Status
export const statusList: StatusItem[] = [
    { id: 1, nome: 'Em Monitoramento', descricao: 'Evento ativo sob vigilância.', cor: '#EAB308' }, // Yellow-500
    { id: 2, nome: 'Finalizado', descricao: 'Monitoramento encerrado.', cor: '#22C55E' }, // Green-500
    { id: 3, nome: 'Aguardando Verificação', descricao: 'Evento cadastrado aguardando dupla checagem.', cor: '#3B82F6' } // Blue-500
];

// Mock data atualizado com campos de auditoria
export const mockData: Monitoramento[] = [
    {
        id: 'RUM-015', idu: '20072024100000', tipo: 'RUM', titulo: 'Suspeita de contaminação em evento gastronômico', status: 'Em Monitoramento', nivelRisco: 'Alto', dataInicio: '2024-07-20', pautadoCMA: true,
        veracidade: 'Suspeito', fundamentoVeracidade: 'Múltiplos relatos em redes sociais e imprensa local.', descricao: 'Relatos de intoxicação alimentar após evento no centro da cidade.', localEvento: 'Urbano', notificadorFonte: 'Imprensa', idPais: 1, idEstado: 1, idCidade: 1, idNatureza: 1,
        gravidade: 4, vulnerabilidade: 4, capacidade_enfrentamento: 3, nivelConfianca: 'Boa', tipoVigilancia: 'Passiva',
        tipoEncaminhamento: 'Para Providência',
        duplaVerificacao: false,
        usuarioCadastro: 'Ana Silva',
        usuarioVerificacao: 'Carlos Pereira',
        usuarioCadastroId: 1, dataCadastro: '2024-07-20T10:00:00',
        tags: ['Alimentos', 'Intoxicação', 'Evento Público']
    },
    {
        id: 'COM-007', idu: '15072024143000', tipo: 'COM', titulo: 'Resolução ANVISA sobre novo medicamento', status: 'Finalizado', dataInicio: '2024-07-15', pautadoCMA: false, dataConclusao: '2024-07-25',
        dataEmail: '2024-07-15', acaoAdotada: 'Publicação de nota informativa', cnpj: '12.345.678/0001-99', categoria: 'Medicamentos', escopo: 'Nacional', produto: 'Med-X', lote: 'LOTE-123', nomeEmpresa: 'FarmaCorp', resolucao: 'RDC Nº 123/2024', url: 'https://anvisa.gov.br/res123', dataDou: '2024-07-16', motivoAcao: 'Atualização de bula', emailNotificador: 'ceavs@saude.gov.br',
        usuarioCadastroId: 2, dataCadastro: '2024-07-15T14:30:00'
    },
    {
        id: 'RUM-021', idu: '10072024090000', tipo: 'RUM', titulo: 'Boato sobre fechamento de hospital regional', status: 'Finalizado', nivelRisco: 'Moderado', dataInicio: '2024-07-10', pautadoCMA: false, dataConclusao: '2024-07-18',
        veracidade: 'Descartado', fundamentoVeracidade: 'Nota oficial da secretaria de saúde desmentiu o boato.', descricao: 'Áudios em grupos de mensagem alegavam o fechamento iminente.', localEvento: 'Hospitalar', notificadorFonte: 'Redes Sociais', idPais: 1, idEstado: 2, idCidade: 4, idNatureza: 3,
        gravidade: 3, vulnerabilidade: 3, capacidade_enfrentamento: 2, nivelConfianca: 'Satisfatório', tipoVigilancia: 'Passiva',
        tipoEncaminhamento: 'Para Conhecimento',
        duplaVerificacao: true, dataVerificacao: '2024-07-12', observacaoVerificacao: 'Verificado com a diretoria do hospital.',
        usuarioCadastro: 'Roberto Souza',
        usuarioVerificacao: 'Ana Silva',
        usuarioCadastroId: 3, dataCadastro: '2024-07-10T09:00:00',
        tags: ['Fake News', 'Hospital', 'Redes Sociais']
    },
    {
        id: 'EVT-003', idu: '22072024081500', tipo: 'EVT', titulo: 'Aumento de casos de virose na região metropolitana', status: 'Em Monitoramento', nivelRisco: 'Muito Alto', dataInicio: '2024-07-22', pautadoCMA: true,
        veracidade: 'Confirmado', fundamentoVeracidade: 'Dados epidemiológicos confirmam o aumento.', descricao: 'Aumento de 50% nos atendimentos por virose nas últimas 48h.', localEvento: 'Urbano', notificadorFonte: 'Vigilância Epidemiológica', idPais: 1, idEstado: 1, idCidade: 2, idNatureza: 2,
        gravidade: 5, vulnerabilidade: 4, capacidade_enfrentamento: 4, nivelConfianca: 'Boa', tipoVigilancia: 'Ativa',
        tipoEncaminhamento: 'Para Providência',
        duplaVerificacao: false,
        usuarioCadastro: 'Mariana Costa',
        usuarioVerificacao: 'Carlos Pereira',
        usuarioCadastroId: 4, dataCadastro: '2024-07-22T08:15:00',
        tags: ['Virose', 'Epidemiologia', 'Sazonal']
    },
    {
        id: 'RUM-022', idu: '01072024110000', tipo: 'RUM', titulo: 'Alerta de produto impróprio para consumo', status: 'Finalizado', nivelRisco: 'Muito Baixo', dataInicio: '2024-07-01', pautadoCMA: false, dataConclusao: '2024-07-05',
        veracidade: 'Confirmado', fundamentoVeracidade: 'Análise laboratorial confirmou a contaminação.', descricao: 'Consumidor relatou odor estranho em lote de iogurte.', localEvento: 'Urbano', notificadorFonte: 'Consumidor', idPais: 1, idEstado: 3, idCidade: 7, idNatureza: 1,
        gravidade: 1, vulnerabilidade: 2, capacidade_enfrentamento: 1, nivelConfianca: 'Boa', tipoVigilancia: 'Passiva',
        tipoEncaminhamento: 'Para Providência',
        duplaVerificacao: true, dataVerificacao: '2024-07-02', observacaoVerificacao: 'Laudo nº 4521/2024.',
        usuarioCadastro: 'Ana Silva',
        usuarioVerificacao: 'Mariana Costa',
        usuarioCadastroId: 1, dataCadastro: '2024-07-01T11:00:00',
        tags: ['Alimentos', 'Consumidor']
    },
    {
        id: 'RUM-018', idu: '28062024162000', tipo: 'RUM', titulo: 'Aumento de casos de doença respiratória', status: 'Em Monitoramento', nivelRisco: 'Moderado', dataInicio: '2024-06-28', pautadoCMA: false,
        veracidade: 'Suspeito', fundamentoVeracidade: 'Aguardando confirmação laboratorial.', descricao: 'Unidades de saúde relatam aumento de atendimentos.', localEvento: 'Urbano', notificadorFonte: 'Vigilância em Saúde', idPais: 1, idEstado: 2, idCidade: 5, idNatureza: 3,
        gravidade: 3, vulnerabilidade: 4, capacidade_enfrentamento: 3, nivelConfianca: 'Insatisfatório', tipoVigilancia: 'Ativa',
        tipoEncaminhamento: 'Para Conhecimento',
        duplaVerificacao: false,
        usuarioCadastro: 'Roberto Souza',
        usuarioCadastroId: 3, dataCadastro: '2024-06-28T16:20:00'
    },
    {
        id: 'COM-009', idu: '15062024130000', tipo: 'COM', titulo: 'Recolhimento de lote de alimento industrializado', status: 'Finalizado', dataInicio: '2024-06-15', pautadoCMA: false, dataConclusao: '2024-06-25',
        dataEmail: '2024-06-15', acaoAdotada: 'Recolhimento voluntário do produto', cnpj: '98.765.432/0001-11', categoria: 'Alimentos', escopo: 'Regional', produto: 'Biscoito Saboroso', lote: 'LOTE-ABC', nomeEmpresa: 'Alimentos ABC', resolucao: 'N/A', url: 'https://empresa.com/recall', dataDou: '', motivoAcao: 'Contaminação por corpo estranho', emailNotificador: 'vigilancia@saude.local',
        usuarioCadastroId: 2, dataCadastro: '2024-06-15T13:00:00'
    },
];

export const areas: Area[] = [
    { id: 1, sigla: 'VISA', nome: 'Vigilância Sanitária', descricao: 'Responsável por ações de vigilância sanitária.', naturezaIds: [1] },
    { id: 2, sigla: 'VIEP', nome: 'Vigilância Epidemiológica', descricao: 'Responsável por ações de vigilância epidemiológica.', naturezaIds: [3] },
    { id: 3, sigla: 'LACEN', nome: 'Laboratório Central', descricao: 'Laboratório de referência.', naturezaIds: [1, 2] },
    { id: 4, sigla: 'ASCOM', nome: 'Comunicação Social', descricao: 'Assessoria de comunicação.', naturezaIds: [] },
];

export const representantes: Representante[] = [
    { id: 1, nome: 'João da Silva', titularidade: 'Titular', email: 'joao.silva@email.com', area_vinculada: 1 },
    { id: 2, nome: 'Maria Oliveira', titularidade: 'Vice', email: 'maria.oliveira@email.com', area_vinculada: 1 },
    { id: 3, nome: 'Carlos Pereira', titularidade: 'Titular', email: 'carlos.pereira@email.com', area_vinculada: 2 },
    { id: 4, nome: 'Ana Costa', titularidade: 'Titular', email: 'ana.costa@email.com', area_vinculada: 3 },
];

export const naturezas: Natureza[] = [
    { id: 1, descricao: 'Surtos Alimentares' }, 
    { id: 2, descricao: 'Acidentes Químicos' }, 
    { id: 3, descricao: 'Zoonoses' }
];

export const icmras: Icmra[] = [
    { id: 1, descricao: 'Reporte de Eficácia' },
    { id: 2, descricao: 'Segurança do Paciente' },
    { id: 3, descricao: 'Qualidade Farmacêutica' }
];

export const paises: Pais[] = [
    { id: 1, nome: 'Brasil' },
];

export const estados: Estado[] = [
    { id: 1, nome: 'DF', idPais: 1 },
    { id: 2, nome: 'SP', idPais: 1 },
    { id: 3, nome: 'RJ', idPais: 1 },
];

export const cidades: Cidade[] = [
    { id: 1, nome: 'Brasília', idEstado: 1 },
    { id: 2, nome: 'São Paulo', idEstado: 2 },
    { id: 3, nome: 'Campinas', idEstado: 2 },
    { id: 4, nome: 'Rio de Janeiro', idEstado: 3 },
];
