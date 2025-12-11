
import { Request, Response } from 'express';
import { sql } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logAudit } from '../services/AuditService';

export const login = async (req: any, res: any) => {
    const { email, password } = req.body;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT ID_LOGIN, NOME, EMAIL, SENHA, PERFIL FROM LOGIN WHERE EMAIL = @email AND INATIVO = 0');

        if (result.recordset.length === 0) {
            // Log de tentativa de login falha (usuário inexistente)
            await logAudit(null, email, 'LOGIN_FAIL', 'LOGIN', null, null, { reason: 'User not found' }, req.ip);
            return res.status(400).json({ message: 'Usuário não encontrado ou inativo.' });
        }

        const user = result.recordset[0];

        const validPassword = await bcrypt.compare(password, user.SENHA);
        if (!validPassword) {
            // Log de tentativa de login falha (senha incorreta)
            await logAudit(user.ID_LOGIN, user.NOME, 'LOGIN_FAIL', 'LOGIN', null, null, { reason: 'Invalid password' }, req.ip);
            return res.status(400).json({ message: 'Senha incorreta.' });
        }

        const token = jwt.sign(
            { id: user.ID_LOGIN, nome: user.NOME, role: user.PERFIL || 'USER' },
            process.env.JWT_SECRET || 'secret_key_padrao',
            { expiresIn: '8h' }
        );

        // --- AUDITORIA SUCESSO ---
        await logAudit(user.ID_LOGIN, user.NOME, 'LOGIN', 'LOGIN', null, null, { session_start: new Date() }, req.ip);

        res.json({
            token,
            user: {
                id: user.ID_LOGIN,
                nome: user.NOME,
                email: user.EMAIL,
                role: user.PERFIL || 'USER'
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

export const register = async (req: any, res: any) => {
    const { nome, email, login, password, perfil } = req.body;
    const adminUser = req.user; // Quem está cadastrando (Admin)

    try {
        const pool = await sql.connect();
        const check = await pool.request()
            .input('email', sql.VarChar, email)
            .input('login', sql.VarChar, login)
            .query('SELECT ID_LOGIN FROM LOGIN WHERE EMAIL = @email OR LOGIN = @login');
            
        if (check.recordset.length > 0) {
            return res.status(400).json({ message: 'Email ou Login já cadastrados.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.request()
            .input('nome', sql.VarChar, nome)
            .input('email', sql.VarChar, email)
            .input('login', sql.VarChar, login)
            .input('senha', sql.VarChar, hashedPassword)
            .input('perfil', sql.VarChar, perfil || 'USER')
            .query(`
                INSERT INTO LOGIN (NOME, EMAIL, LOGIN, SENHA, INATIVO, PERFIL)
                OUTPUT INSERTED.ID_LOGIN
                VALUES (@nome, @email, @login, @senha, 0, @perfil)
            `);
        
        const newUserId = result.recordset[0].ID_LOGIN;

        // --- AUDITORIA ---
        await logAudit(
            adminUser.id, adminUser.nome, 'INSERT', 'LOGIN', newUserId, null, { nome, email, perfil }, req.ip
        );

        res.status(201).json({ message: 'Usuário criado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar usuário.' });
    }
};
