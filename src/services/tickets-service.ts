import { TicketType, Tickets } from "@/protocols";
import { ticketsRepository } from "@/repositories/tickets-repository";
import { notFoundError } from "@/errors";
import { TicketStatus } from '@prisma/client';


async function getAllTicketType(): Promise<TicketType[]> {

    return await ticketsRepository.getTicketType();
}


async function getTickets(userId: number): Promise<Tickets> {

  const enrollment = await ticketsRepository.searchEnrollment(userId);
  if (!enrollment) throw notFoundError();

  const tickets = await ticketsRepository.searchTickets(enrollment.id);
  if (!tickets) throw notFoundError();

  return tickets;

}

async function createTickets(ticketTypeId: number, userId: number): Promise<Tickets>{

  const enrollment = await ticketsRepository.searchEnrollment(userId);
  if (!enrollment) throw notFoundError();

  const ticketFormat = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };

  await ticketsRepository.postTickets(ticketFormat);

  const tickets = await ticketsRepository.searchTickets(enrollment.id);

  return tickets;

}

export const ticketsService = {
  getAllTicketType,
  getTickets,
  createTickets
};
