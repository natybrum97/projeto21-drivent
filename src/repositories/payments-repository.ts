import { prisma } from '@/config';
import { Payment } from '@/protocols';

export type Create = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

async function searchTicketId(ticketId: number) {
  return prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });
}

async function searchUserId(enrollment: number) {
  return prisma.enrollment.findFirst({
    where: {
      id: enrollment,
    },
  });
}

async function getPayments(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function searchPrice(ticketTypeId: number) {
  return prisma.ticketType.findUnique({
    where: {
      id: ticketTypeId,
    },
  });
}

async function createPayments(Payment: Create) {
  const create = await prisma.payment.create({
    data: Payment,
  });

  return create;
}

async function updateTicket(ticketId: number) {
  const update = await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });

  return update;
}

export const paymentsRepository = {
  searchTicketId,
  searchUserId,
  getPayments,
  searchPrice,
  createPayments,
  updateTicket,
};
