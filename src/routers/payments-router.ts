import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { paymentsController } from '@/controllers';

const paymentsRouter = Router();

// Aplica o middleware de autenticação a todas as rotas
paymentsRouter.use(authenticateToken);

//poderia fazer assim:
//ticketsRouter.all('/*', authenticateToken);

// Define as rotas
paymentsRouter.get('/', paymentsController.getPayment).post('/process', paymentsController.createPayment);

export { paymentsRouter };
