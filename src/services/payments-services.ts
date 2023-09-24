import { Payment } from "@/protocols";
import { paymentsRepository } from "@/repositories/payments-repository";
import { notFoundError, unauthorizedError } from "@/errors";

async function getPayment(ticketId: number, userId: number): Promise<Payment> {

  const searchTicketId = await paymentsRepository.searchTicketId(ticketId);
  
  if (!searchTicketId) throw notFoundError();

  const enrollment = searchTicketId.enrollmentId;

  const searchUserId = await paymentsRepository.searchUserId(enrollment);

  if (searchUserId.userId !== userId) throw unauthorizedError();

  const getPayment = await paymentsRepository.getPayments(ticketId);

  return getPayment

}

export const paymentsService = {
    getPayment
};
