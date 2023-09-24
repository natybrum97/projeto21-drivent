import { Payment, Data } from '@/protocols';
import { paymentsRepository } from '@/repositories/payments-repository';
import { notFoundError, unauthorizedError } from '@/errors';

async function getPayment(ticketId: number, userId: number): Promise<Payment> {
  const searchTicketId = await paymentsRepository.searchTicketId(ticketId);

  if (!searchTicketId) throw notFoundError();

  const enrollment = searchTicketId.enrollmentId;

  const searchUserId = await paymentsRepository.searchUserId(enrollment);

  if (searchUserId.userId !== userId) throw unauthorizedError();

  const getPayment = await paymentsRepository.getPayments(ticketId);

  return getPayment;
}

async function createPayment(cardData: Data, ticketId: number, userId: number): Promise<Payment> {
  const searchTicketId = await paymentsRepository.searchTicketId(ticketId);

  if (!searchTicketId) throw notFoundError();

  const enrollment = searchTicketId.enrollmentId;

  const searchUserId = await paymentsRepository.searchUserId(enrollment);

  if (searchUserId.userId !== userId) throw unauthorizedError();

  const price = await paymentsRepository.searchPrice(searchTicketId.ticketTypeId);

  const Payment = {
    ticketId: searchTicketId.id,
    value: price.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  await paymentsRepository.createPayments(Payment);

  await paymentsRepository.updateTicket(ticketId);

  const getPayment = await paymentsRepository.getPayments(ticketId);

  return getPayment;
}

export const paymentsService = {
  getPayment,
  createPayment,
};
