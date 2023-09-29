import { notFoundError, PaymentRequired } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { hotelsRepository } from '@/repositories/hotels-repository';

async function getHotels(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const ticketype = await hotelsRepository.findTicketType(ticket.ticketTypeId);
    if (ticketype.includesHotel === false) throw notFoundError();

    const hotels = await hotelsRepository.getHotels();
    if (!hotels) throw notFoundError();

    if(ticket.status === "RESERVED" || ticketype.includesHotel !== true || ticketype.isRemote === true) throw PaymentRequired();


  return hotels;
}

async function getHotelsById(userId: number) {
  //const enrollment = await hotelsRepository.findWithAddressByUserId(userId);
 // if (!enrollment) throw notFoundError();

 // const ticket = await hotelsRepository.findTicketByEnrollmentId(enrollment.id);
  //if (!ticket) throw notFoundError();

 // return ticket;
}

export const hotelsService = {
    getHotels,
    getHotelsById
  };