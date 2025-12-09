import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Import Controllers
import * as AuthController from './controllers/AuthController';
import * as DomainController from './controllers/DomainController';
import * as MonitoramentoController from './controllers/MonitoramentoController';
import { verifyToken, verifyAdmin } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Fix for: Argument of type 'NextHandleFunction' is not assignable to parameter of type 'PathParams'
app.use(cors() as unknown as express.RequestHandler);
app.use(express.json());

// Database Connection
connectDB();

// Routes
// -- Auth
app.post('/api/login', AuthController.login);
app.post('/api/register', verifyToken, verifyAdmin, AuthController.register);

// -- Domínios
app.get('/api/naturezas', verifyToken, DomainController.getNaturezas);
app.get('/api/areas', verifyToken, DomainController.getAreas);
app.get('/api/icmras', verifyToken, DomainController.getIcmras);
app.get('/api/paises', verifyToken, DomainController.getPaises);
app.get('/api/estados/:idPais', verifyToken, DomainController.getEstados);
app.get('/api/cidades/:idEstado', verifyToken, DomainController.getCidades);

// -- Monitoramento
app.get('/api/rumores', verifyToken, MonitoramentoController.getRumores);
app.post('/api/rumores', verifyToken, MonitoramentoController.createRumor);
app.post('/api/comunicacoes', verifyToken, MonitoramentoController.createComunicacao);

// Health Check
app.get('/', (req, res) => {
    res.send('API SIMRE-CEAVS (Node.js) rodando!');
});

// Start
app.listen(PORT, () => {
    console.log(`✅ Servidor Node.js rodando na porta ${PORT}`);
});