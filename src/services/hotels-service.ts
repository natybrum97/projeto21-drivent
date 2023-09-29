import { notFoundError, PaymentRequired } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { hotelsRepository } from '@/repositories/hotels-repository';

async function getHotels(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const hotels = await hotelsRepository.getHotels();
    if (!hotels || hotels.length === 0) throw notFoundError();

    const ticketype = await hotelsRepository.findTicketType(ticket.ticketTypeId);

    if(ticket.status === "RESERVED" || ticketype.includesHotel === false || ticketype.isRemote === true) throw PaymentRequired();

  return hotels;
}

async function getHotelsById(userId: number, idHotel: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const hotels = await hotelsRepository.getHotelsById(idHotel);
    if (!hotels) throw notFoundError();

    if(ticket.status === "RESERVED" || ticket.TicketType.includesHotel === false || ticket.TicketType.isRemote === true) throw PaymentRequired();


    return hotels;
}

export const hotelsService = {
    getHotels,
    getHotelsById
  };