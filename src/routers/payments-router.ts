import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { paymentsController } from '@/controllers';
import { paymentSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

// Aplica o middleware de autenticação a todas as rotas
paymentsRouter.use(authenticateToken);

//poderia fazer assim:
//ticketsRouter.all('/*', authenticateToken);

// Define as rotas
paymentsRouter
  .get('/', paymentsController.getPayment)
  .post('/process', validateBody(paymentSchema), paymentsController.createPayment);

export { paymentsRouter };
