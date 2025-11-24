
import { Request, Response } from 'express';
import { sql } from '../config/db';

export const getNaturezas = async (req: Request, res: Response) => {
    try {
        const pool = await sql.connect();
        // Alias para coincidir com interface Natureza { id, descricao }
        const result = await pool.request().query('SELECT ID_NATUREZA as id, DESCRICAO_NATUREZA as descricao FROM NATUREZA');
        (res as any).json(result.recordset);
    } catch (error) {
        (res as any).status(500).json({ error: 'Erro ao buscar naturezas' });
    }
};

export const getAreas = async (req: Request, res: Response) => {
    try {
        const pool = await sql.connect();
        // Alias para coincidir com interface Area
        const result = await pool.request().query('SELECT ID_AREA as id, SIGLA as sigla, NOME_AREA as nome, DESCRICAO as descricao FROM AREA');
        (res as any).json(result.recordset);
    } catch (error) {
        (res as any).status(500).json({ error: 'Erro ao buscar areas' });
    }
};

export const getIcmras = async (req: Request, res: Response) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT ID_ICMRA as id, DESCRICAO_ICMRA as descricao FROM ICMRA');
        (res as any).json(result.recordset);
    } catch (error) {
        (res as any).status(500).json({ error: 'Erro ao buscar ICMRAs' });
    }
};

export const getPaises = async (req: Request, res: Response) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT ID_PAIS as id, NOME_PAIS as nome FROM PAIS');
        (res as any).json(result.recordset);
    } catch (error) {
        (res as any).status(500).json({ error: 'Erro ao buscar paises' });
    }
};

export const getEstados = async (req: Request, res: Response) => {
    const { idPais } = (req as any).params;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('idPais', sql.Int, idPais)
            .query('SELECT ID_ESTADO as id, NOME_SIGLA as nome FROM ESTADO WHERE ID_PAIS = @idPais');
        (res as any).json(result.recordset);
    } catch (error) {
        (res as any).status(500).json({ error: 'Erro ao buscar estados' });
    }
};

export const getCidades = async (req: Request, res: Response) => {
    const { idEstado } = (req as any).params;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
             .input('idEstado', sql.Int, idEstado)
             .query('SELECT ID_CIDADE as id, NOME_CIDADE as nome FROM CIDADE WHERE ID_ESTADO = @idEstado');
        (res as any).json(result.recordset);
    } catch (error) {
        (res as any).status(500).json({ error: 'Erro ao buscar cidades' });
    }
};
