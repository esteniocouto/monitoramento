import { Request, Response } from 'express';
import { sql } from '../config/db';

export const getNaturezas = async (req: any, res: any) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT ID_NATUREZA as id, DESCRICAO_NATUREZA as descricao FROM NATUREZA');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar naturezas' });
    }
};

export const getAreas = async (req: any, res: any) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT ID_AREA as id, SIGLA as sigla, NOME_AREA as nome, DESCRICAO as descricao FROM AREA');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar areas' });
    }
};

export const getIcmras = async (req: any, res: any) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT ID_ICMRA as id, DESCRICAO as descricao FROM ICMRA');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ICMRAs' });
    }
};

export const getPaises = async (req: any, res: any) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT ID_PAIS as id, NOME as nome FROM PAIS');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar paises' });
    }
};

export const getEstados = async (req: any, res: any) => {
    const { idPais } = req.params;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('idPais', sql.Int, idPais)
            .query('SELECT ID_ESTADO as id, NOME as nome FROM ESTADO WHERE ID_PAIS = @idPais');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estados' });
    }
};

export const getCidades = async (req: any, res: any) => {
    const { idEstado } = req.params;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
             .input('idEstado', sql.Int, idEstado)
             .query('SELECT ID_CIDADE as id, NOME as nome FROM CIDADE WHERE ID_ESTADO = @idEstado');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cidades' });
    }
};