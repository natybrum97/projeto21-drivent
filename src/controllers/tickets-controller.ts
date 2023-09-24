import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';
import { ticketsService } from '@/services/tickets-service';
import { invalidDataError } from '@/errors';

export async function getTicketType(req: AuthenticatedRequest, res: Response) {

  const TicketType = await ticketsService.getAllTicketType();

  res.status(httpStatus.OK).send(TicketType);

}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const Ticket = await ticketsService.getTickets(userId);

    res.status(httpStatus.OK).send(Ticket);
    
  }

  export async function createTickets(req: AuthenticatedRequest, res: Response) {
    const { ticketTypeId } = req.body;
    console.log(ticketTypeId)
    const { userId } = req;

    if (!ticketTypeId) throw invalidDataError('TicketTypeId não foi enviado');

    const Ticket = await ticketsService.createTickets(ticketTypeId, userId);

    res.status(httpStatus.CREATED).send(Ticket);
    
  }

  export const ticketsController = {
    getTicketType,
    getTickets,
    createTickets
  };
  