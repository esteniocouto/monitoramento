
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// Force 127.0.0.1 if not specified to avoid IPv6 localhost issues in Node v17+
const server = process.env.DB_SERVER || '127.0.0.1';
const isNamedInstance = server.includes('\\');

const config: sql.config = {
    user: process.env.DB_USER || 'teste',
    password: process.env.DB_PASSWORD || '123456',
    server: server,
    database: process.env.DB_NAME || 'monitoramento',
    options: {
        encrypt: false, // Keep false for local self-signed certs
        trustServerCertificate: true, // Required for local dev
        enableArithAbort: true,
        // If it's a named instance (e.g. .\SQLEXPRESS), extracts the name
        instanceName: isNamedInstance ? server.split('\\')[1] : undefined
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// If named instance, the driver often requires the server to be just the hostname (or IP)
// and the instance name in options.instanceName
if (isNamedInstance) {
    config.server = server.split('\\')[0];
    // If the split result is empty (e.g. start with .\), assume localhost/127.0.0.1
    if (config.server === '.' || config.server === '') {
        config.server = '127.0.0.1';
    }
}

export const connectDB = async () => {
    try {
        console.log(`🔌 Tentando conectar ao SQL Server...`);
        console.log(`   Host: ${config.server}`);
        if (config.options?.instanceName) console.log(`   Instância: ${config.options.instanceName}`);
        console.log(`   Banco: ${config.database}`);
        console.log(`   Usuário: ${config.user}`);
        
        await sql.connect(config);
        console.log('✅ SQL Server Conectado com Sucesso!');
    } catch (err: any) {
        console.error('❌ Falha Crítica na conexão com o Banco de Dados.');
        console.error(`Erro Original: ${err.message}`);
        
        if (err.code === 'ESOCKET') {
            console.log('\n--- ⚠️  ERRO DE CONEXÃO TCP/IP (ESOCKET) ---');
            console.log('O Node.js não conseguiu conectar na porta 1433 do IP 127.0.0.1.');
            console.log('SOLUÇÃO OBRIGATÓRIA NO WINDOWS:');
            console.log('1. Abra o "SQL Server Configuration Manager".');
            console.log('2. Vá em "SQL Server Network Configuration" > "Protocols for [SEU INSTANCIA]".');
            console.log('3. Certifique-se que "TCP/IP" está "Enabled".');
            console.log('4. Clique com botão direito em TCP/IP > Properties > Aba "IP Addresses".');
            console.log('5. Role até o final em "IPAll".');
            console.log('   - TCP Dynamic Ports: [Deixe em Branco]');
            console.log('   - TCP Port: 1433');
            console.log('6. Reinicie o serviço do SQL Server em "SQL Server Services".');
        } else if (err.code === 'ELOGIN') {
            console.log('\n--- ⚠️  ERRO DE LOGIN ---');
            console.log('Usuário ou senha incorretos.');
            console.log(`Verifique se o usuário '${config.user}' existe e a senha está correta.`);
        }
    }
};

export { sql };
