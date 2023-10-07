import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
  });
}

export async function createRoomWithZeroCapacity(hotelId: number) {
  return prisma.room.create({
    data: {
      name: 'Number Room',
      capacity: 0,
      hotelId: hotelId,
    },
  });
}

export const bookingFactory = {
  createBooking,
  createRoomWithZeroCapacity,
};
