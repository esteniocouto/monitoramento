
import { Request, Response } from 'express';
import { sql } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    const { email, password } = (req as any).body;

    try {
        const pool = await sql.connect();
        // Retrieve PERFIL column
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT ID_LOGIN, NOME, EMAIL, SENHA, PERFIL FROM LOGIN WHERE EMAIL = @email AND INATIVO = 0');

        if (result.recordset.length === 0) {
            return (res as any).status(400).json({ message: 'Usuário não encontrado ou inativo.' });
        }

        const user = result.recordset[0];

        const validPassword = await bcrypt.compare(password, user.SENHA);
        if (!validPassword) {
            return (res as any).status(400).json({ message: 'Senha incorreta.' });
        }

        // Include role (PERFIL) in token
        const token = jwt.sign(
            { id: user.ID_LOGIN, nome: user.NOME, role: user.PERFIL || 'USER' },
            process.env.JWT_SECRET || 'secret_key_padrao',
            { expiresIn: '8h' }
        );

        (res as any).json({
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
        (res as any).status(500).json({ message: 'Erro interno no servidor.' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { nome, email, login, password, perfil } = (req as any).body;

    // Validate profile
    const validProfiles = ['ADMIN', 'USER'];
    const userProfile = validProfiles.includes(perfil) ? perfil : 'USER';

    try {
        // Check if user exists
        const pool = await sql.connect();
        const check = await pool.request()
            .input('email', sql.VarChar, email)
            .input('login', sql.VarChar, login)
            .query('SELECT ID_LOGIN FROM LOGIN WHERE EMAIL = @email OR LOGIN = @login');
            
        if (check.recordset.length > 0) {
            return (res as any).status(400).json({ message: 'Email ou Login já cadastrados.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.request()
            .input('nome', sql.VarChar, nome)
            .input('email', sql.VarChar, email)
            .input('login', sql.VarChar, login)
            .input('senha', sql.VarChar, hashedPassword)
            .input('perfil', sql.VarChar, userProfile)
            .query(`
                INSERT INTO LOGIN (NOME, EMAIL, LOGIN, SENHA, INATIVO, PERFIL)
                VALUES (@nome, @email, @login, @senha, 0, @perfil)
            `);

        (res as any).status(201).json({ message: 'Usuário criado com sucesso.' });
    } catch (error) {
        console.error(error);
        (res as any).status(500).json({ message: 'Erro ao criar usuário.' });
    }
};
