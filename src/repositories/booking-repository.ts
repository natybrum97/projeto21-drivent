import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';
import { CreateTicketParams } from '@/protocols';

async function findBooking(userId: number) {
    return await prisma.booking.findUnique({
        where: {
          userId: userId,
        },
        include: {
          Room: true,
        },
      });
}

async function existRoomId(roomId: number) {
  return await prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    }
  });
}

async function existBookingId(bookingId: number) {
  return await prisma.booking.findFirst({
    where: {
      id: bookingId,
    }
  });
}

async function putBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    }
  });
}

export const bookingRepository = {
    findBooking,
    existRoomId,
    createBooking,
    existBookingId,
    putBooking
  };
  