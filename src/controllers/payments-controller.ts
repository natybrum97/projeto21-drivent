import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { paymentsService } from '@/services';
import { invalidDataError } from '@/errors';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query;
  const { userId } = req;

  if (!ticketId) throw invalidDataError('ticketId não foi enviado');

  const ticketIdAsNumber = parseInt(ticketId as string, 10);

  if (isNaN(ticketIdAsNumber)) throw invalidDataError('ticketId não é um número válido');

  const payment = await paymentsService.getPayment(ticketIdAsNumber, userId);

  res.status(httpStatus.OK).send(payment);
}

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  const { cardData, ticketId } = req.body;

  const { userId } = req;

  if (!cardData || !ticketId) throw invalidDataError('cardData e/ou ticketId não foi/foram enviado(s)');

  const payment = await paymentsService.createPayment(cardData, ticketId, userId);

  res.status(httpStatus.OK).send(payment);
}

export const paymentsController = {
  getPayment,
  createPayment,
};
