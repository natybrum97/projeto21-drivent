import { prisma } from '@/config';

async function findTicketType(ticketTypeId: number) {
  return prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId,
    },
  });
}

async function getHotels() {
  const result = await prisma.hotel.findMany();
  return result;
}

async function getHotelsById(idHotel: number) {
  const result = await prisma.hotel.findUnique({
    where: {
      id: idHotel,
    },
    include: {
      Rooms: true,
    },
  });
  return result;
}

export const hotelsRepository = {
  findTicketType,
  getHotels,
  getHotelsById,
};
