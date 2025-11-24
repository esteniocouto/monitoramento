
import { Request, Response } from 'express';
import { sql } from '../config/db';

// --- Rumor/Evento ---

export const getRumores = async (req: Request, res: Response) => {
    try {
        const pool = await sql.connect();
        // Seleciona com Aliases para facilitar o mapeamento no frontend ou mapeia manualmente abaixo
        const result = await pool.request().query(`
            SELECT 
                R.ID_RUMOR_EVENTO, R.TITULO, R.DESCRICAO, R.DATA_RECEBIMENTO, R.VERACIDADE, 
                R.LOCAL_EVENTO, R.FUNDAMENTO_VERACIDADE, R.NOTIFICADOR_FONTE,
                S.DESCRICAO_STATUS,
                N.DESCRICAO_NATUREZA,
                R.ID_NATUREZA, R.ID_PAIS, R.ID_ESTADO, R.ID_CIDADE
            FROM RUMOR_EVENTO R
            LEFT JOIN STATUS S ON R.ID_STATUS = S.ID_STATUS
            LEFT JOIN NATUREZA N ON R.ID_NATUREZA = N.ID_NATUREZA
        `);
        
        // Mapeamento manual para garantir compatibilidade com a interface 'RumorEventoData'
        const mappedRumores = result.recordset.map(row => ({
            id: `RUM-${row.ID_RUMOR_EVENTO}`, // Prefixo visual
            originalId: row.ID_RUMOR_EVENTO,
            tipo: 'RUM', // Simplificação: assumindo RUMOR por enquanto
            titulo: row.TITULO,
            status: row.DESCRICAO_STATUS || 'Em Monitoramento',
            nivelRisco: 'Moderado', // Placeholder: O risco vem de outra tabela (RISCO) que precisaria de LEFT JOIN
            dataInicio: row.DATA_RECEBIMENTO ? new Date(row.DATA_RECEBIMENTO).toISOString().split('T')[0] : '',
            pautadoCMA: false, // Placeholder
            descricao: row.DESCRICAO,
            veracidade: row.VERACIDADE,
            fundamentoVeracidade: row.FUNDAMENTO_VERACIDADE,
            localEvento: row.LOCAL_EVENTO,
            notificadorFonte: row.NOTIFICADOR_FONTE,
            idPais: row.ID_PAIS,
            idEstado: row.ID_ESTADO,
            idCidade: row.ID_CIDADE,
            idNatureza: row.ID_NATUREZA
        }));

        (res as any).json(mappedRumores);
    } catch (error) {
        console.error(error);
        (res as any).status(500).json({ error: 'Erro ao buscar rumores' });
    }
};

export const createRumor = async (req: Request, res: Response) => {
    const data = (req as any).body;
    const userId = (req as any).user.id; 

    try {
        const pool = await sql.connect();
        const request = pool.request();
        
        request.input('titulo', sql.VarChar, data.titulo);
        request.input('descricao', sql.VarChar, data.descricao);
        request.input('localEvento', sql.VarChar, data.localEvento);
        request.input('notificadorFonte', sql.VarChar, data.notificadorFonte);
        // Converter string vazia para null ou data válida
        request.input('dataRecebimento', sql.Date, data.dataRecebimento || new Date()); 
        request.input('veracidade', sql.VarChar, data.veracidade);
        request.input('fundamentoVeracidade', sql.VarChar, data.fundamentoVeracidade);
        request.input('idPais', sql.Int, Number(data.idPais) || null);
        request.input('idEstado', sql.Int, Number(data.idEstado) || null);
        request.input('idCidade', sql.Int, Number(data.idCidade) || null);
        request.input('idNatureza', sql.Int, Number(data.idNatureza) || null);
        request.input('idIcmra', sql.Int, Number(data.idIcmra) || null);
        request.input('idStatus', sql.Int, 1); // 1 = Em Monitoramento
        request.input('idUsuario', sql.Int, userId);

        const result = await request.query(`
            INSERT INTO RUMOR_EVENTO (
                TITULO, DESCRICAO, LOCAL_EVENTO, NOTIFICADOR_FONTE, DATA_RECEBIMENTO, 
                VERACIDADE, FUNDAMENTO_VERACIDADE, ID_PAIS, ID_ESTADO, ID_CIDADE, 
                ID_NATUREZA, ID_ICMRA, ID_STATUS, ID_USUARIO_CADASTRO, DATA_CADASTRO
            )
            OUTPUT INSERTED.ID_RUMOR_EVENTO
            VALUES (
                @titulo, @descricao, @localEvento, @notificadorFonte, @dataRecebimento,
                @veracidade, @fundamentoVeracidade, @idPais, @idEstado, @idCidade,
                @idNatureza, @idIcmra, @idStatus, @idUsuario, GETDATE()
            )
        `);

        (res as any).status(201).json({ id: result.recordset[0].ID_RUMOR_EVENTO, message: 'Rumor criado com sucesso' });

    } catch (error) {
        console.error(error);
        (res as any).status(500).json({ error: 'Erro ao criar rumor' });
    }
};

// --- Comunicação de Risco ---

export const getComunicacoes = async (req: Request, res: Response) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query(`
            SELECT C.* FROM COMUNICACAO C
        `);
        
        const mappedComs = result.recordset.map(row => ({
            id: `COM-${row.ID_COMUNICACAO}`,
            tipo: 'COM',
            titulo: row.PRODUTO ? `Comunicação: ${row.PRODUTO}` : 'Nova Comunicação',
            status: 'Finalizado', // Placeholder, pois Comunicação nao tem status no banco
            nivelRisco: 'Baixo',
            dataInicio: row.DATA_EMAIL ? new Date(row.DATA_EMAIL).toISOString().split('T')[0] : '',
            pautadoCMA: false,
            
            dataEmail: row.DATA_EMAIL,
            acaoAdotada: row.ACAO,
            cnpj: row.CNPJ,
            categoria: row.CATEGORIA,
            escopo: row.ESCOPO,
            produto: row.PRODUTO,
            lote: row.LOTE,
            nomeEmpresa: row.NOME_EMPRESA,
            resolucao: row.RESOLUCAO,
            url: row.URL,
            dataDou: row.DATA_DOU,
            motivoAcao: row.MOTIVO,
            emailNotificador: row.EMAIL_NOTIFICADOR
        }));

        (res as any).json(mappedComs);
    } catch (error) {
        (res as any).status(500).json({ error: 'Erro ao buscar comunicações' });
    }
};

export const createComunicacao = async (req: Request, res: Response) => {
    const data = (req as any).body;
    const userId = (req as any).user.id;

    try {
        const pool = await sql.connect();
        const request = pool.request();

        request.input('dataEmail', sql.Date, data.dataEmail || new Date());
        request.input('acao', sql.VarChar, data.acaoAdotada);
        request.input('cnpj', sql.VarChar, data.cnpj);
        request.input('categoria', sql.VarChar, data.categoria);
        request.input('escopo', sql.VarChar, data.escopo);
        request.input('produto', sql.VarChar, data.produto);
        request.input('lote', sql.VarChar, data.lote);
        request.input('nomeEmpresa', sql.VarChar, data.nomeEmpresa);
        request.input('resolucao', sql.VarChar, data.resolucao);
        request.input('url', sql.VarChar, data.url);
        request.input('dataDou', sql.Date, data.dataDou || null);
        request.input('motivo', sql.VarChar, data.motivoAcao);
        request.input('emailNotificador', sql.VarChar, data.emailNotificador);
        request.input('idUsuario', sql.Int, userId);

        const result = await request.query(`
            INSERT INTO COMUNICACAO (
                DATA_EMAIL, ACAO, CNPJ, CATEGORIA, ESCOPO, PRODUTO, LOTE, 
                NOME_EMPRESA, RESOLUCAO, URL, DATA_DOU, MOTIVO, EMAIL_NOTIFICADOR,
                ID_USUARIO_CADASTRO, DATA_CADASTRO
            )
            OUTPUT INSERTED.ID_COMUNICACAO
            VALUES (
                @dataEmail, @acao, @cnpj, @categoria, @escopo, @produto, @lote,
                @nomeEmpresa, @resolucao, @url, @dataDou, @motivo, @emailNotificador,
                @idUsuario, GETDATE()
            )
        `);

        (res as any).status(201).json({ id: result.recordset[0].ID_COMUNICACAO, message: 'Comunicação criada com sucesso' });

    } catch (error) {
        console.error(error);
        (res as any).status(500).json({ error: 'Erro ao criar comunicação' });
    }
};
