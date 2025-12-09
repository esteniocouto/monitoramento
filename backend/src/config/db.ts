import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'sua_senha_forte',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'SIMRECEAVS',
    options: {
        encrypt: false, // Usar false para conexões locais sem SSL configurado
        trustServerCertificate: true, // Necessário para self-signed certs locais
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

export const connectDB = async () => {
    try {
        console.log(`🔌 Tentando conectar ao SQL Server em ${config.server}...`);
        await sql.connect(config);
        console.log('✅ SQL Server Conectado com Sucesso!');
    } catch (err: any) {
        console.error('❌ Falha na conexão com o Banco de Dados.');
        console.error(err);
    }
};

export { sql };