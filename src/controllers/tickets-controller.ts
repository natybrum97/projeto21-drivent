import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';
import { ticketsService } from '@/services/tickets-service';

export async function getTicketType(req: AuthenticatedRequest, res: Response) {

  const TicketType = await ticketsService.getAllTicketType();

  res.status(httpStatus.OK).send(TicketType);

}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const Ticket = await ticketsService.getTickets(userId);

    res.status(httpStatus.OK).send(Ticket);
    
  }

  export const ticketsController = {
    getTicketType,
    getTickets
  };
  