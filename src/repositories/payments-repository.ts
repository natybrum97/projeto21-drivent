import { prisma } from '@/config';

async function searchTicketId(ticketId: number) {

  return prisma.ticket.findUnique({
    where: {
      id: ticketId
    }
  });

}

async function searchUserId(enrollment : number) {

  return prisma.enrollment.findFirst({
    where: {
      id: enrollment
    }
  });

}

async function getPayments(ticketId : number) {

    return prisma.payment.findFirst({
      where: {
        ticketId
      }
    });
  
  }

export const paymentsRepository = {
    searchTicketId,
    searchUserId,
    getPayments
};
