
import { sql } from '../config/db';

export const logAudit = async (
    userId: number | null,
    userName: string | null,
    action: 'INSERT' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGIN_FAIL' | 'ERROR',
    table: string | null,
    recordId: string | number | null,
    oldData: any | null,
    newData: any | null,
    ip: string
) => {
    try {
        const pool = await sql.connect();
        
        // Converter objetos para string JSON, se existirem
        const oldDataStr = oldData ? JSON.stringify(oldData) : null;
        const newDataStr = newData ? JSON.stringify(newData) : null;

        await pool.request()
            .input('idUsuario', sql.Int, userId)
            .input('nomeUsuario', sql.VarChar, userName)
            .input('tipoAcao', sql.VarChar, action)
            .input('tabelaAfetada', sql.VarChar, table)
            .input('idRegistro', sql.VarChar, String(recordId))
            .input('dadosAnteriores', sql.NVarChar(sql.MAX), oldDataStr)
            .input('dadosNovos', sql.NVarChar(sql.MAX), newDataStr)
            .input('ipOrigem', sql.VarChar, ip)
            .query(`
                INSERT INTO LOG_AUDITORIA 
                (ID_USUARIO, NOME_USUARIO, TIPO_ACAO, TABELA_AFETADA, ID_REGISTRO_AFETADO, DADOS_ANTERIORES, DADOS_NOVOS, IP_ORIGEM)
                VALUES 
                (@idUsuario, @nomeUsuario, @tipoAcao, @tabelaAfetada, @idRegistro, @dadosAnteriores, @dadosNovos, @ipOrigem)
            `);
            
        console.log(`[AUDIT] ${action} em ${table || 'SISTEMA'} por ${userName || 'Desconhecido'}`);
        
    } catch (error) {
        console.error("FALHA AO GRAVAR LOG DE AUDITORIA:", error);
        // Não lançamos o erro para não interromper o fluxo principal do usuário
        // mas em um sistema crítico, isso deveria ser tratado com fila de retry.
    }
};
