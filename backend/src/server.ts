import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db';

// Controllers
import * as AuthController from './controllers/AuthController';
import * as DomainController from './controllers/DomainController';
import * as MonitoramentoController from './controllers/MonitoramentoController';
import { verifyToken, verifyAdmin } from './middleware/auth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors() as any);
app.use(express.json() as any);

// Database
connectDB();

// Routes API
app.post('/api/login', AuthController.login);
app.post('/api/register', verifyToken, verifyAdmin, AuthController.register); 

app.get('/api/naturezas', verifyToken, DomainController.getNaturezas);
app.get('/api/areas', verifyToken, DomainController.getAreas);
app.get('/api/icmras', verifyToken, DomainController.getIcmras);
app.get('/api/paises', verifyToken, DomainController.getPaises);
app.get('/api/estados/:idPais', verifyToken, DomainController.getEstados);
app.get('/api/cidades/:idEstado', verifyToken, DomainController.getCidades);

app.get('/api/rumores', verifyToken, MonitoramentoController.getRumores);
app.post('/api/rumores', verifyToken, MonitoramentoController.createRumor);
app.get('/api/comunicacoes', verifyToken, MonitoramentoController.getComunicacoes);
app.post('/api/comunicacoes', verifyToken, MonitoramentoController.createComunicacao);

// --- SERVIR FRONTEND EM PRODUÇÃO (Estaticamente) ---
// Define a pasta 'dist' (build do React) como estática
const frontendBuildPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendBuildPath));

// Qualquer rota que não seja API será direcionada para o index.html do React
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse via: http://localhost:${PORT}`);
});