import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { ticketsController } from '@/controllers';

const ticketsRouter = Router();

// Aplica o middleware de autenticação a todas as rotas
ticketsRouter.use(authenticateToken);

//poderia fazer assim:
//ticketsRouter.all('/*', authenticateToken);

// Define as rotas
ticketsRouter
  .get('/types', ticketsController.getTicketType)
  .get('/', ticketsController.getTickets)
  .post('/', ticketsController.createTickets);

export { ticketsRouter };
