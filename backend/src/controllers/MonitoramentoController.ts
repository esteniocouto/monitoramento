
import { Request, Response } from 'express';
import { sql } from '../config/db';
import { logAudit } from '../services/AuditService';

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
            ORDER BY R.DATA_RECEBIMENTO DESC
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
            idNatureza: row.ID_NATUREZA
        }));

        res.json(mappedRumores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar rumores' });
    }
};

export const createRumor = async (req: any, res: any) => {
    const data = req.body;
    const user = req.user; // Do JWT

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
        request.input('idUsuario', sql.Int, user.id);
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

        const newId = result.recordset[0].ID_RUMOR_EVENTO;

        // --- AUDITORIA ---
        await logAudit(
            user.id, user.nome, 'INSERT', 'RUMOR_EVENTO', newId, null, data, req.ip
        );

        res.status(201).json({ id: newId, message: 'Rumor criado com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar rumor' });
    }
};

export const updateRumor = async (req: any, res: any) => {
    const { id } = req.params;
    const data = req.body;
    const user = req.user;

    try {
        const pool = await sql.connect();

        // 1. Buscar dados antigos para auditoria
        const oldDataResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM RUMOR_EVENTO WHERE ID_RUMOR_EVENTO = @id');
        
        if (oldDataResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Registro não encontrado.' });
        }
        const oldData = oldDataResult.recordset[0];

        // 2. Executar Update
        const request = pool.request();
        request.input('id', sql.Int, id);
        // Mapear campos (simplificado para exemplo, idealmente seria dinâmico ou completo)
        request.input('titulo', sql.VarChar, data.titulo || oldData.TITULO);
        request.input('descricao', sql.VarChar, data.descricao || oldData.DESCRICAO);
        request.input('veracidade', sql.VarChar, data.veracidade || oldData.VERACIDADE);
        request.input('status', sql.VarChar, data.status); // Exemplo de campo de controle
        
        // Logica simplificada: Atualizando apenas alguns campos principais
        await request.query(`
            UPDATE RUMOR_EVENTO 
            SET TITULO = @titulo, DESCRICAO = @descricao, VERACIDADE = @veracidade
            WHERE ID_RUMOR_EVENTO = @id
        `);

        // 3. --- AUDITORIA ---
        await logAudit(
            user.id, user.nome, 'UPDATE', 'RUMOR_EVENTO', id, oldData, data, req.ip
        );

        res.json({ message: 'Atualizado com sucesso.' });

    } catch (error: any) {
        console.error(error);
        // Log de tentativa falha (opcional)
        await logAudit(user.id, user.nome, 'ERROR', 'RUMOR_EVENTO', id, null, { error: error.message }, req.ip);
        res.status(500).json({ error: 'Erro ao atualizar rumor' });
    }
};

export const deleteRumor = async (req: any, res: any) => {
    const { id } = req.params;
    const user = req.user;

    try {
        const pool = await sql.connect();

        // 1. Buscar dados antigos antes de deletar
        const oldDataResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM RUMOR_EVENTO WHERE ID_RUMOR_EVENTO = @id');

        if (oldDataResult.recordset.length === 0) {
             // Mesmo se falhar em achar, registra tentativa se quiser
             await logAudit(user.id, user.nome, 'DELETE', 'RUMOR_EVENTO', id, null, { status: 'NOT_FOUND' }, req.ip);
             return res.status(404).json({ message: 'Registro não encontrado.' });
        }
        const oldData = oldDataResult.recordset[0];

        // 2. Deletar (ou inativar logicamente)
        // Aqui faremos Delete físico conforme pedido, mas o log salva o histórico
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM RUMOR_EVENTO WHERE ID_RUMOR_EVENTO = @id');

        // 3. --- AUDITORIA ---
        await logAudit(
            user.id, user.nome, 'DELETE', 'RUMOR_EVENTO', id, oldData, { status: 'DELETED' }, req.ip
        );

        res.json({ message: 'Excluído com sucesso.' });

    } catch (error: any) {
        console.error(error);
        // Log de erro ao tentar excluir (restrição de FK, etc)
        await logAudit(user.id, user.nome, 'ERROR', 'RUMOR_EVENTO', id, null, { action: 'DELETE_ATTEMPT', error: error.message }, req.ip);
        res.status(500).json({ error: 'Erro ao excluir rumor. Pode haver registros vinculados.' });
    }
};


// --- Comunicação de Risco ---

export const createComunicacao = async (req: any, res: any) => {
    const data = req.body;
    const user = req.user;

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
        request.input('idUsuario', sql.Int, user.id);

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
        
        const newId = result.recordset[0].ID_COMUNICACAO;
        
        // --- AUDITORIA ---
        await logAudit(
            user.id, user.nome, 'INSERT', 'COMUNICACAO', newId, null, data, req.ip
        );

        res.status(201).json({ id: newId, message: 'Comunicação criada com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar comunicação' });
    }
};
