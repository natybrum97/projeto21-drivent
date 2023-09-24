import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketsController } from '@/controllers';
import { ticketsSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

// Aplica o middleware de autenticação a todas as rotas
ticketsRouter.use(authenticateToken);

//poderia fazer assim:
//ticketsRouter.all('/*', authenticateToken);

// Define as rotas
ticketsRouter
  .get('/types', ticketsController.getTicketType)
  .get('/', ticketsController.getTickets)
  .post('/', validateBody(ticketsSchema), ticketsController.createTickets);

export { ticketsRouter };
