
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Controllers
import * as AuthController from './controllers/AuthController';
import * as DomainController from './controllers/DomainController';
import * as MonitoramentoController from './controllers/MonitoramentoController';
import { verifyToken, verifyAdmin } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors() as any);
app.use(express.json() as any);

// Database
connectDB();

// Routes

// Public Auth
app.post('/api/login', AuthController.login);

// Protected Auth (Only Admins can register new users)
app.post('/api/register', verifyToken, verifyAdmin, AuthController.register); 

// Domain Data (Public or Protected, depending on reqs)
app.get('/api/naturezas', verifyToken, DomainController.getNaturezas);
app.get('/api/areas', verifyToken, DomainController.getAreas);
app.get('/api/icmras', verifyToken, DomainController.getIcmras);
app.get('/api/paises', verifyToken, DomainController.getPaises);
app.get('/api/estados/:idPais', verifyToken, DomainController.getEstados);
app.get('/api/cidades/:idEstado', verifyToken, DomainController.getCidades);

// Monitoramentos (Protected)
app.get('/api/rumores', verifyToken, MonitoramentoController.getRumores);
app.post('/api/rumores', verifyToken, MonitoramentoController.createRumor);

app.get('/api/comunicacoes', verifyToken, MonitoramentoController.getComunicacoes);
app.post('/api/comunicacoes', verifyToken, MonitoramentoController.createComunicacao);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
