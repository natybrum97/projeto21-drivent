import { Ticket } from '@prisma/client';
import { prisma } from '@/config';

export type CreateTicket = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

async function getTicketType() {
  return prisma.ticketType.findMany();
}

async function searchEnrollment(userId: number) {
  return prisma.enrollment.findUnique({
    where: {
      userId,
    },
  });
}

async function searchTickets(id: number) {
  return prisma.ticket.findUnique({
    where: {
      enrollmentId: id,
    },
    include: {
      TicketType: true,
    },
  });
}

async function postTickets(ticket: CreateTicket) {
  const create = await prisma.ticket.create({
    data: {
      ...ticket,
    },
    include: {
      TicketType: true,
    },
  });

  return create;
}

export const ticketsRepository = {
  getTicketType,
  searchEnrollment,
  searchTickets,
  postTickets,
};
