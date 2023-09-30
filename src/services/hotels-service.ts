import { PaymentRequired, notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { hotelsRepository } from '@/repositories/hotels-repository';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status === 'RESERVED' || ticket.TicketType.includesHotel === false || ticket.TicketType.isRemote === true)
    throw PaymentRequired();

  const hotels = await hotelsRepository.getHotels();
  if (!hotels || hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotelsById(userId: number, idHotel: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status === 'RESERVED' || ticket.TicketType.includesHotel === false || ticket.TicketType.isRemote === true)
    throw PaymentRequired();

  const hotels = await hotelsRepository.getHotels();
  if (!hotels || hotels.length === 0) throw notFoundError();

  const hotelById = await hotelsRepository.getHotelsById(idHotel);

  return hotelById;
}

export const hotelsService = {
  getHotels,
  getHotelsById,
};
