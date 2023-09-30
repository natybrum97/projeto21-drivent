import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotels() {
  const resultado = prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.internet.url(),
      updatedAt: new Date(),
    },
  });

  return resultado;
}
