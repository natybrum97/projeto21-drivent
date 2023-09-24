import { prisma } from '@/config';

async function getTicketType() {

  return prisma.ticketType.findMany();

}

async function searchEnrollment(userId: number) {

  return prisma.enrollment.findUnique({
    where: {
      userId
    }
  });

}

async function searchTickets(id : number) {

  return prisma.ticket.findUnique({
    where: {
      id
    },
    include: {
      TicketType: true
    }
  });

}

export const ticketsRepository = {
    getTicketType,
    searchEnrollment,
    searchTickets
};
