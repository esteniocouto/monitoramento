import { Request, Response } from 'express';
import { sql } from '../config/db';

// --- Rumor/Evento ---

export const getRumores = async (req: any, res: any) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query(`
            SELECT 
                R.*, 
                S.NOME as STATUS_NOME,
                N.DESCRICAO_NATUREZA
            FROM RUMOR_EVENTO R
            LEFT JOIN STATUS S ON R.ID_STATUS = S.ID_STATUS
            LEFT JOIN NATUREZA N ON R.ID_NATUREZA = N.ID_NATUREZA
        `);
        
        // Mapeamento para formato do frontend
        const mappedRumores = result.recordset.map(row => ({
            id: row.ID_RUMOR_EVENTO,
            idu: row.IDU,
            tipo: 'RUM',
            titulo: row.TITULO,
            status: row.STATUS_NOME || 'Em Monitoramento',
            descricao: row.DESCRICAO,
            dataInicio: row.DATA_RECEBIMENTO,
            localEvento: row.LOCAL_EVENTO,
            veracidade: row.VERACIDADE,
            // Adicione outros campos conforme necessidade
        }));

        res.json(mappedRumores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar rumores' });
    }
};

export const createRumor = async (req: any, res: any) => {
    const data = req.body;
    const userId = (req as any).user.id; 

    try {
        const pool = await sql.connect();
        const request = pool.request();
        
        // Gerar IDU simples
        const now = new Date();
        const idu = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);

        request.input('idu', sql.VarChar, idu);
        request.input('titulo', sql.VarChar, data.titulo);
        request.input('descricao', sql.VarChar, data.descricao);
        request.input('localEvento', sql.VarChar, data.localEvento);
        request.input('notificadorFonte', sql.VarChar, data.notificadorFonte);
        request.input('dataRecebimento', sql.Date, data.dataRecebimento || new Date()); 
        request.input('veracidade', sql.VarChar, data.veracidade);
        request.input('fundamentoVeracidade', sql.VarChar, data.fundamentoVeracidade);
        request.input('idPais', sql.Int, Number(data.idPais) || null);
        request.input('idEstado', sql.Int, Number(data.idEstado) || null);
        request.input('idCidade', sql.Int, Number(data.idCidade) || null);
        request.input('idNatureza', sql.Int, Number(data.idNatureza) || null);
        request.input('idIcmra', sql.Int, Number(data.idIcmra) || null);
        request.input('idStatus', sql.Int, 1); // 1 = Padrão (Ex: Em Monitoramento)
        request.input('idUsuario', sql.Int, userId);
        request.input('tipoVigilancia', sql.VarChar, data.tipoVigilancia);
        request.input('tipoEncaminhamento', sql.VarChar, data.tipoEncaminhamento);

        const result = await request.query(`
            INSERT INTO RUMOR_EVENTO (
                IDU, TITULO, DESCRICAO, LOCAL_EVENTO, NOTIFICADOR_FONTE, DATA_RECEBIMENTO, 
                VERACIDADE, FUNDAMENTO_VERACIDADE, ID_PAIS, ID_ESTADO, ID_CIDADE, 
                ID_NATUREZA, ID_ICMRA, ID_STATUS, ID_USUARIO_CADASTRO, TIPO_VIGILANCIA, TIPO_ENCAMINHAMENTO
            )
            OUTPUT INSERTED.ID_RUMOR_EVENTO
            VALUES (
                @idu, @titulo, @descricao, @localEvento, @notificadorFonte, @dataRecebimento,
                @veracidade, @fundamentoVeracidade, @idPais, @idEstado, @idCidade,
                @idNatureza, @idIcmra, @idStatus, @idUsuario, @tipoVigilancia, @tipoEncaminhamento
            )
        `);

        res.status(201).json({ id: result.recordset[0].ID_RUMOR_EVENTO, message: 'Rumor criado com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar rumor' });
    }
};

// --- Comunicação de Risco ---

export const createComunicacao = async (req: any, res: any) => {
    const data = req.body;
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
                ID_USUARIO_CADASTRO
            )
            OUTPUT INSERTED.ID_COMUNICACAO
            VALUES (
                @dataEmail, @acao, @cnpj, @categoria, @escopo, @produto, @lote,
                @nomeEmpresa, @resolucao, @url, @dataDou, @motivo, @emailNotificador,
                @idUsuario
            )
        `);

        res.status(201).json({ id: result.recordset[0].ID_COMUNICACAO, message: 'Comunicação criada com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar comunicação' });
    }
};